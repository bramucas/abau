import { Fragment } from "react";
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

function formatSubject(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlanCard({ modality, subjects, degree_scores }: Plan) {
  const byCourse = (course: "curso1" | "curso2") =>
    subjects.filter((s) => s.course === course);

  // Assign a color to every curso2 subject
  const s2ColorMap: Record<string, { bg: string; pin: string }> = {};
  subjects
    .filter((s) => s.course === "curso2")
    .forEach((s, i) => { s2ColorMap[s.subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length]; });

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

          return (
            <Fragment key={i}>
              {/* curso1 card */}
              <div className="rounded-xl px-3 py-2 flex flex-col justify-center bg-gray-100 border border-gray-200">
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                  {isPinned && (
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0"
                      style={{ background: "rgba(255,255,255,0.22)", boxShadow: `0 0 0 1.5px ${pinColors[0]}33` }}
                    >
                      <Pin size={13} fill="currentColor" style={{ color: pinColors[0] }} />
                    </span>
                  )}
                  {formatSubject(s1.subject)}
                </span>
              </div>

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
