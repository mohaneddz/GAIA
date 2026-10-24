"""Patients and saved analyses, in a local SQLite file."""

import json
import os
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

DB_PATH = Path(os.environ.get("GAIA_DB", Path(__file__).resolve().parent / "data" / "gaia.sqlite3"))

SCHEMA = """
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    mrn TEXT UNIQUE,
    birth_year INTEGER,
    sex TEXT CHECK (sex IN ('F', 'M', 'X')),
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
    kind TEXT NOT NULL CHECK (kind IN ('vision', 'risk')),
    model TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    flagged INTEGER NOT NULL DEFAULT 0,
    result TEXT NOT NULL,
    thumbnail TEXT,
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS analyses_patient ON analyses(patient_id, created_at);
CREATE INDEX IF NOT EXISTS analyses_created ON analyses(created_at);
"""


class NotFound(LookupError):
    pass


class Invalid(ValueError):
    pass


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    connection.executescript(SCHEMA)
    return connection


def patient_row(row):
    return {
        "id": row["id"], "name": row["name"], "mrn": row["mrn"], "birthYear": row["birth_year"],
        "sex": row["sex"], "notes": row["notes"], "createdAt": row["created_at"],
        **({"analysisCount": row["analysis_count"], "lastAnalysisAt": row["last_analysis_at"], "flaggedCount": row["flagged_count"]}
           if "analysis_count" in row.keys() else {}),
    }


def analysis_row(row, with_result=True):
    data = {
        "id": row["id"], "patientId": row["patient_id"], "kind": row["kind"], "model": row["model"],
        "title": row["title"], "summary": row["summary"], "flagged": bool(row["flagged"]),
        "thumbnail": row["thumbnail"], "note": row["note"], "createdAt": row["created_at"],
    }
    if "patient_name" in row.keys():
        data["patientName"] = row["patient_name"]
    if with_result:
        data["result"] = json.loads(row["result"])
    return data


def clean_patient(body, partial=False):
    if not isinstance(body, dict):
        raise Invalid("expected a JSON object")
    fields = {}
    if "name" in body or not partial:
        name = body.get("name")
        if not isinstance(name, str) or not name.strip():
            raise Invalid("name is required")
        fields["name"] = name.strip()[:120]
    if "mrn" in body:
        mrn = body["mrn"]
        if mrn is not None and (not isinstance(mrn, str) or len(mrn) > 40):
            raise Invalid("mrn must be text of 40 characters or fewer")
        fields["mrn"] = mrn.strip() or None if isinstance(mrn, str) else None
    if "birthYear" in body:
        year = body["birthYear"]
        if year is not None and (isinstance(year, bool) or not isinstance(year, int) or not 1900 <= year <= datetime.now().year):
            raise Invalid("birthYear must be a year between 1900 and now")
        fields["birth_year"] = year
    if "sex" in body:
        if body["sex"] not in (None, "F", "M", "X"):
            raise Invalid("sex must be F, M or X")
        fields["sex"] = body["sex"]
    if "notes" in body:
        if not isinstance(body["notes"], str):
            raise Invalid("notes must be text")
        fields["notes"] = body["notes"][:4000]
    return fields


PATIENT_SUMMARY = """
SELECT p.*, COUNT(a.id) AS analysis_count, MAX(a.created_at) AS last_analysis_at,
       COALESCE(SUM(a.flagged), 0) AS flagged_count
FROM patients p LEFT JOIN analyses a ON a.patient_id = p.id
"""


def list_patients(query=""):
    with connect() as db:
        rows = db.execute(
            PATIENT_SUMMARY + " WHERE p.name LIKE ? OR COALESCE(p.mrn, '') LIKE ? GROUP BY p.id ORDER BY p.name COLLATE NOCASE",
            (f"%{query}%", f"%{query}%"),
        ).fetchall()
    return [patient_row(r) for r in rows]


def get_patient(patient_id):
    with connect() as db:
        row = db.execute(PATIENT_SUMMARY + " WHERE p.id = ? GROUP BY p.id", (patient_id,)).fetchone()
    if row is None:
        raise NotFound(f"patient {patient_id}")
    return patient_row(row)


def create_patient(body):
    fields = clean_patient(body)
    fields["created_at"] = now()
    try:
        with connect() as db:
            cursor = db.execute(
                f"INSERT INTO patients ({', '.join(fields)}) VALUES ({', '.join('?' for _ in fields)})", tuple(fields.values())
            )
    except sqlite3.IntegrityError:
        raise Invalid("a patient with that MRN already exists")
    return get_patient(cursor.lastrowid)


def update_patient(patient_id, body):
    fields = clean_patient(body, partial=True)
    get_patient(patient_id)
    if fields:
        try:
            with connect() as db:
                db.execute(f"UPDATE patients SET {', '.join(f'{k} = ?' for k in fields)} WHERE id = ?", (*fields.values(), patient_id))
        except sqlite3.IntegrityError:
            raise Invalid("a patient with that MRN already exists")
    return get_patient(patient_id)


def delete_patient(patient_id):
    with connect() as db:
        if db.execute("DELETE FROM patients WHERE id = ?", (patient_id,)).rowcount == 0:
            raise NotFound(f"patient {patient_id}")


def save_analysis(body):
    if not isinstance(body, dict):
        raise Invalid("expected a JSON object")
    kind, model = body.get("kind"), body.get("model")
    if kind not in ("vision", "risk") or not isinstance(model, str):
        raise Invalid("kind must be vision or risk, and model is required")
    for key in ("title", "summary"):
        if not isinstance(body.get(key), str) or not body[key].strip():
            raise Invalid(f"{key} is required")
    if not isinstance(body.get("result"), dict):
        raise Invalid("result must be an object")
    thumbnail = body.get("thumbnail")
    if thumbnail is not None and (not isinstance(thumbnail, str) or not thumbnail.startswith("data:image/") or len(thumbnail) > 200_000):
        raise Invalid("thumbnail must be an image data URL under 200 kB")
    patient_id = body.get("patientId")
    if patient_id is not None:
        get_patient(patient_id)

    with connect() as db:
        cursor = db.execute(
            "INSERT INTO analyses (patient_id, kind, model, title, summary, flagged, result, thumbnail, note, created_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (patient_id, kind, model, body["title"][:120], body["summary"][:200], int(bool(body.get("flagged"))),
             json.dumps(body["result"]), thumbnail, str(body.get("note", ""))[:2000], now()),
        )
    return get_analysis(cursor.lastrowid)


ANALYSIS_SELECT = "SELECT a.*, p.name AS patient_name FROM analyses a LEFT JOIN patients p ON p.id = a.patient_id"


def get_analysis(analysis_id):
    with connect() as db:
        row = db.execute(ANALYSIS_SELECT + " WHERE a.id = ?", (analysis_id,)).fetchone()
    if row is None:
        raise NotFound(f"analysis {analysis_id}")
    return analysis_row(row)


def list_analyses(patient_id=None, model=None, flagged_only=False, limit=100):
    clauses, params = [], []
    if patient_id is not None:
        clauses.append("a.patient_id = ?")
        params.append(patient_id)
    if model:
        clauses.append("a.model = ?")
        params.append(model)
    if flagged_only:
        clauses.append("a.flagged = 1")
    where = f" WHERE {' AND '.join(clauses)}" if clauses else ""
    with connect() as db:
        rows = db.execute(ANALYSIS_SELECT + where + " ORDER BY a.created_at DESC, a.id DESC LIMIT ?", (*params, limit)).fetchall()
    return [analysis_row(r, with_result=False) for r in rows]


def delete_analysis(analysis_id):
    with connect() as db:
        if db.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,)).rowcount == 0:
            raise NotFound(f"analysis {analysis_id}")


def stats(days=14):
    since = (datetime.now(timezone.utc) - timedelta(days=days - 1)).date()
    with connect() as db:
        patients = db.execute("SELECT COUNT(*) FROM patients").fetchone()[0]
        totals = db.execute("SELECT COUNT(*), COALESCE(SUM(flagged), 0) FROM analyses").fetchone()
        by_model = db.execute("SELECT model, title, COUNT(*) AS n, SUM(flagged) AS flagged FROM analyses GROUP BY model ORDER BY n DESC").fetchall()
        per_day = dict(db.execute(
            "SELECT substr(created_at, 1, 10) AS day, COUNT(*) FROM analyses WHERE day >= ? GROUP BY day", (since.isoformat(),)
        ).fetchall())
    return {
        "patients": patients,
        "analyses": totals[0],
        "flagged": totals[1],
        "byModel": [{"model": r["model"], "title": r["title"], "count": r["n"], "flagged": r["flagged"]} for r in by_model],
        "perDay": [
            {"day": (since + timedelta(days=i)).isoformat(), "count": per_day.get((since + timedelta(days=i)).isoformat(), 0)}
            for i in range(days)
        ],
    }
