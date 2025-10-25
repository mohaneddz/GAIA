"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideSearch, Clock, Activity, User } from "lucide-react";

type Patient = {
  id: number;
  name: string;
  age: number;
  condition: string;
  visits: number;
  lastVisit: string; // ISO
  critical: boolean;
  tags: string[];
  notes: string;
};

export default function Patients() {
  const [query, setQuery] = useState("");

  // 25 dummy patients
  const patients: Patient[] = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => {
        const id = i + 1;
        const condIndex = i % 6;
        const conds = [
          "Hypertension",
          "Diabetes",
          "Asthma",
          "Arrhythmia",
          "Post-op follow-up",
          "Chronic pain",
        ];
        return {
          id,
          name: `Patient ${id.toString().padStart(2, "0")}`,
          age: 22 + (i % 60),
          condition: conds[condIndex],
          visits: (i % 5) + 1,
          lastVisit: new Date(Date.now() - i * 86400000).toISOString(), // i days ago
          critical: i % 8 === 0,
          tags: [`cond:${condIndex + 1}`, i % 3 === 0 ? "repeat" : "single"],
          notes: `Summary: Follow-up for ${conds[condIndex]}. Meds stable. ${i % 4 === 0 ? "Needs review." : ""}`,
        };
      }),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      [
        p.name,
        p.condition,
        p.notes,
        String(p.age),
        ...p.tags,
        p.lastVisit,
      ].some((field) => field.toLowerCase().includes(q))
    );
  }, [patients, query]);

  return (
    <div className="full center col py-12">
      <div className="w-full p-16">
        {/* Header - centered */}
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Patients
          </h1>
          <p className="text-sm text-slate-600 mb-6 max-w-2xl">
            Clean patient roster — search, scan history notes, and spot critical cases at a glance.
          </p>

          {/* Centered search bar */}
          <div className="w-full sm:w-[620px]">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <LucideSearch size={18} />
              </span>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, condition, notes, tags..."
                className="pl-11 pr-4 py-3 rounded-full shadow-md border-gray-200 bg-white/40"
              />
            </div>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} /> {filtered.length} results
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Activity size={14} /> Updated live
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <ScrollArea className="h-[72vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {filtered.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200
                           hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-250"
              >
                {p.critical && (
                  <Badge className="absolute right-3 top-3 bg-red-600 text-white px-2 py-0.5">
                    CRITICAL
                  </Badge>
                )}

                <CardHeader className="pt-4 px-4 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-linear-to-tr from-sky-400 to-indigo-500 text-white">
                        <User size={18} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {p.name}
                        </CardTitle>
                        <div className="text-xs text-slate-500 -mt-0.5">
                          {p.condition} • {p.age} yrs
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="text-slate-500">Visits</div>
                      <div className="font-medium text-slate-700">{p.visits}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pt-2 pb-3">
                  <p className="text-sm text-slate-700 line-clamp-3">{p.notes}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(p.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-1 flex gap-2">
                  <Button variant="default" className="flex-1 text-sm">
                    View History
                  </Button>
                  <Button variant="secondary" className="text-sm">
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 text-center w-full">
              <p className="text-slate-500">No patients match your search.</p>
              <Button className="mt-4" onClick={() => setQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
