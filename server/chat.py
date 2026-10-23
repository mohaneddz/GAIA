"""Groq chat completions, called server-side so the API key never reaches the browser."""

import json
import os
import urllib.error
import urllib.request

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-oss-120b"
HISTORY_LIMIT = 12

SYSTEM_PROMPT = (
    "You are GAIA, an assistant inside a clinical dashboard used by doctors. "
    "Answer concisely in markdown, using headings to separate sections and about three lines per section. "
    "Use few emojis. You are not a substitute for clinical judgement; say so when a question needs a clinician."
)


class ChatUnavailable(RuntimeError):
    pass


def chat_enabled():
    return bool(os.environ.get("GROQ_API_KEY"))


def build_messages(history, added_features):
    system = SYSTEM_PROMPT
    if added_features:
        system += (
            "\nThe user has pinned these dashboard features, so assume their results are available: "
            + ", ".join(added_features)
            + "."
        )
    return [{"role": "system", "content": system}, *history[-HISTORY_LIMIT:]]


def post_json(url, payload, api_key):
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "gaia-signal-server",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def complete(history, added_features):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ChatUnavailable("GROQ_API_KEY is not set on the server")

    payload = {
        "model": os.environ.get("GROQ_MODEL", DEFAULT_MODEL),
        "messages": build_messages(history, added_features),
    }
    try:
        body = post_json(GROQ_URL, payload, api_key)
    except urllib.error.HTTPError as error:
        raise ChatUnavailable(f"Groq returned {error.code}") from error
    except urllib.error.URLError as error:
        raise ChatUnavailable("Could not reach Groq") from error

    return body["choices"][0]["message"]["content"]
