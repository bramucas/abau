import { Fragment, useState } from "react";
import { Pin } from "lucide-react";
import { DegreeScore, Plan } from "../api/client";

// bg: Tailwind *-300 (card background)  pin: Tailwind *-700 (icon, high contrast)
const SUBJECT_COLORS = [
  { bg: "#fca5a5", pin: "#b91c1c" }, // red
  { bg: "#fcd34d", pin: "#b45309" }, // amber
  { bg: "#86efac", pin: "#15803d" }, // green
  { bg: "#5eead4", pin: "#0f766e" }, // teal
  { bg: "#7dd3fc", pin: "#0369a1" }, // sky
  { bg: "#c4b5fd", pin: "#6d28d9" }, // violet
  { bg: "#f9a8d4", pin: "#be185d" }, // pink
];

const TYPE_LABEL: Record<string, string> = {
  oblig: "Obligatoria",
  opcion: "Opción",
  optativa: "Optativa",
};

const TYPE_CLASS: Record<string, string> = {
  oblig:    "bg-rose-100 text-rose-700",
  opcion:   "bg-sky-100 text-sky-700",
  optativa: "bg-emerald-100 text-emerald-700",
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${TYPE_CLASS[type] ?? "bg-gray-100 text-gray-600"}`}>
      {TYPE_LABEL[type] ?? type}
    </span>
  );
}

function formatSubject(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlanCard({ modality, subjects, degree_scores, open_picks }: Plan) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const byCourse = (course: "curso1" | "curso2") =>
    subjects.filter((s) => s.course === course);

  // Assign a color to every curso2 subject
  const s2ColorMap: Record<string, { bg: string; pin: string }> = {};
  subjects
    .filter((s) => s.course === "curso2")
    .forEach((s, i) => { s2ColorMap[s.subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length]; });

  // Lookup: subject → types from open_picks
  const openPicksBySubject: Record<string, string[]> = Object.fromEntries(
    open_picks.map((p) => [p.subject, p.types])
  );

  // Reverse: curso1 subject → pin colors of all curso2 subjects that depend on it
  const s1PinsMap: Record<string, string[]> = {};
  for (const s of subjects) {
    const color = s2ColorMap[s.subject];
    if (color) {
      for (const dep of s.depends_on) {
        (s1PinsMap[dep] ??= []).push(color.pin);
      }
    }
  }

  // All fixed (pinned) subject names — excluded from the selectable dropdown
  const pinnedSubjects = new Set(
    subjects.filter((s) => s.course === "curso1" && (s1PinsMap[s.subject]?.length ?? 0) > 0).map((s) => s.subject)
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full capitalize">
          {modality}
        </span>
        {degree_scores.map((ds: DegreeScore) => (
          <span key={ds.degree} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="capitalize">{ds.degree}</span>
            <span className="font-bold text-indigo-700">{ds.max_score}/14</span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {/* column headers */}
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          1º Bacharelato
        </h4>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          2º Bacharelato
        </h4>

        {/* paired rows — one card per course per row */}
        {byCourse("curso1").map((s1, i) => {
          const s2 = byCourse("curso2")[i];
          const pinColors = s1PinsMap[s1.subject] ?? [];
          const isPinned = pinColors.length > 0;
          const s2Color = s2 ? s2ColorMap[s2.subject] : undefined;
          const nonZeroWeights = s2?.weights.filter((w) => w.weight > 0) ?? [];

          const selected = picks[i];

          return (
            <Fragment key={i}>
              {/* curso1 card */}
              {isPinned ? (
                <div className="rounded-xl px-3 py-2 flex flex-col gap-1 bg-gray-100 border border-gray-200">
                  <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0"
                      style={{ background: "rgba(255,255,255,0.22)", boxShadow: `0 0 0 1.5px ${pinColors[0]}33` }}
                    >
                      <Pin size={13} fill="currentColor" style={{ color: pinColors[0] }} />
                    </span>
                    {formatSubject(s1.subject)}
                  </span>
                  {openPicksBySubject[s1.subject] && (
                    <div className="flex gap-1 flex-wrap">
                      {openPicksBySubject[s1.subject].map((t) => <TypeBadge key={t} type={t} />)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div
                    className={`rounded-xl px-3 py-2 flex flex-col gap-1 transition-colors ${
                      selected
                        ? "bg-gray-100 border border-gray-200"
                        : "bg-white border-2 border-dashed border-gray-300 hover:border-indigo-300 cursor-pointer"
                    }`}
                    onClick={() => !selected && setOpenSlot(openSlot === i ? null : i)}
                  >
                    {selected ? (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-gray-800">{formatSubject(selected)}</span>
                          <button
                            className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
                            onClick={(e) => { e.stopPropagation(); setPicks({ ...picks, [i]: "" }); setOpenSlot(null); }}
                          >✕</button>
                        </div>
                        {openPicksBySubject[selected] && (
                          <div className="flex gap-1 flex-wrap">
                            {openPicksBySubject[selected].map((t) => <TypeBadge key={t} type={t} />)}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">+ Engadir materia</span>
                    )}
                  </div>
                  {openSlot === i && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                      {open_picks.filter((pick) => {
                        if (pinnedSubjects.has(pick.subject)) return false;
                        const otherPicks = Object.entries(picks).filter(([k]) => Number(k) !== i).map(([, v]) => v);
                        return !otherPicks.includes(pick.subject);
                      }).map((pick) => (
                        <button
                          key={pick.subject}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between gap-2"
                          onClick={() => { setPicks({ ...picks, [i]: pick.subject }); setOpenSlot(null); }}
                        >
                          <span>{formatSubject(pick.subject)}</span>
                          <span className="flex gap-1 shrink-0">
                            {pick.types.map((t) => <TypeBadge key={t} type={t} />)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* curso2 card */}
              {s2 ? (
                <div
                  className="rounded-xl px-3 py-2 flex flex-col gap-1 bg-gray-100 border border-gray-200"
                  style={{ borderLeftColor: s2Color?.pin, borderLeftWidth: "6px" }}
                >
                  <span className="text-sm font-semibold text-gray-800">
                    {formatSubject(s2.subject)}
                  </span>
                  {nonZeroWeights.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {nonZeroWeights.map((w) => (
                        <span
                          key={w.degree}
                          className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                            w.weight === 2
                              ? "bg-violet-100 text-violet-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {w.degree} ×{w.weight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
