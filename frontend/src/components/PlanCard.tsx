import { Pin } from "lucide-react";
import { DegreeScore, Plan } from "../api/client";

const SUBJECT_COLORS = [
  { bg: "#fef3c7", accent: "#d97706" },
  { bg: "#ccfbf1", accent: "#0d9488" },
  { bg: "#ffe4e6", accent: "#e11d48" },
  { bg: "#e0f2fe", accent: "#0284c7" },
  { bg: "#ede9fe", accent: "#7c3aed" },
  { bg: "#ecfccb", accent: "#65a30d" },
  { bg: "#ffedd5", accent: "#ea580c" },
];

function formatSubject(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlanCard({ modality, subjects, degree_scores }: Plan) {
  const byCourse = (course: "curso1" | "curso2") =>
    subjects.filter((s) => s.course === course);

  // Assign a color to every curso2 subject
  const s2ColorMap: Record<string, { bg: string; accent: string }> = {};
  subjects
    .filter((s) => s.course === "curso2")
    .forEach((s, i) => { s2ColorMap[s.subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length]; });

  // Reverse: curso1 subject → accent colors of all curso2 subjects that depend on it
  const s1AccentsMap: Record<string, string[]> = {};
  for (const s of subjects) {
    const color = s2ColorMap[s.subject];
    if (color) {
      for (const dep of s.depends_on) {
        (s1AccentsMap[dep] ??= []).push(color.accent);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {(["curso1", "curso2"] as const).map((course) => (
          <div key={course}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {course === "curso1" ? "1º Bacharelato" : "2º Bacharelato"}
            </h4>
            <div className="space-y-2">
              {byCourse(course).map((s, i) => {
                const nonZeroWeights = s.weights.filter((w) => w.weight > 0);
                const pinAccents = s1AccentsMap[s.subject] ?? [];
                const isPinned = pinAccents.length > 0;
                const s2Color = s2ColorMap[s.subject];

                if (course === "curso2") {
                  return (
                    <div
                      key={i}
                      className="rounded-xl px-3 py-2 flex flex-col gap-1"
                      style={{ background: s2Color.bg }}
                    >
                      <span className="text-sm font-semibold text-gray-800">
                        {formatSubject(s.subject)}
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
                  );
                }

                return (
                  <div key={i} className="flex flex-col gap-0.5 px-1 py-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {isPinned && (
                        <Pin
                          size={13}
                          className="inline-block mr-1 shrink-0"
                          style={{ color: pinAccents[0] }}
                        />
                      )}
                      {formatSubject(s.subject)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
