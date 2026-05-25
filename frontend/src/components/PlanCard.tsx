import { Fragment, useEffect, useRef, useState } from "react";
import { Pin, X } from "lucide-react";
import { DegreePreference, DegreeScore, OpenPick, Plan, postOpenPicks } from "../api/client";

// Pastel colors for degree badges — bg/bgStrong/text
const DEGREE_COLORS = [
  { bg: "#e0f2fe", bgStrong: "#bae6fd", text: "#0369a1" }, // sky
  { bg: "#ffe4e6", bgStrong: "#fecdd3", text: "#be185d" }, // rose
  { bg: "#ffedd5", bgStrong: "#fed7aa", text: "#c2410c" }, // orange
  { bg: "#ccfbf1", bgStrong: "#99f6e4", text: "#0f766e" }, // teal
  { bg: "#f7fee7", bgStrong: "#ecfccb", text: "#4d7c0f" }, // lime
];

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

export default function PlanCard({ modality, subjects, degree_scores, open_picks, preferences }: Plan & { preferences: DegreePreference[] }) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [localOpenPicks, setLocalOpenPicks] = useState<OpenPick[]>(open_picks);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openSlot === null) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenSlot(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openSlot]);
  const byCourse = (course: "curso1" | "curso2") =>
    subjects.filter((s) => s.course === course);

  // Assign a color to every curso2 subject
  const s2ColorMap: Record<string, { bg: string; pin: string }> = {};
  subjects
    .filter((s) => s.course === "curso2")
    .forEach((s, i) => { s2ColorMap[s.subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length]; });

  // Lookup: subject → types from open_picks
  const openPicksBySubject: Record<string, string[]> = Object.fromEntries(
    localOpenPicks.map((p) => [p.subject, p.types])
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

  // Degree color map: assigned in preferences order
  const degreeColorMap: Record<string, typeof DEGREE_COLORS[0]> = {};
  preferences.forEach((p, i) => {
    degreeColorMap[p.degree] = DEGREE_COLORS[i % DEGREE_COLORS.length];
  });

  // All fixed (pinned) subject names — excluded from the selectable dropdown
  const pinnedSubjects = new Set(
    subjects.filter((s) => s.course === "curso1" && (s1PinsMap[s.subject]?.length ?? 0) > 0).map((s) => s.subject)
  );

  const refreshOpenPicks = async (newPicks: Record<number, string>) => {
    const curso2_subjects = subjects.filter((s) => s.course === "curso2").map((s) => s.subject);
    const curso1_fixed = [
      ...Array.from(pinnedSubjects),
      ...Object.values(newPicks).filter(Boolean),
    ];
    try {
      const res = await postOpenPicks({ preferences, modality, curso2_subjects, curso1_fixed });
      setLocalOpenPicks(res.open_picks);
    } catch {
      // keep previous open_picks on error
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Modalidade</p>
        <p className="text-xl font-bold text-indigo-900 capitalize mb-3">{modality}</p>
        <div className="flex flex-wrap gap-1.5">
          {degree_scores.map((ds: DegreeScore) => {
            const dc = degreeColorMap[ds.degree];
            return (
              <span
                key={ds.degree}
                className="text-xs px-2.5 py-1 rounded-lg font-semibold capitalize flex items-center gap-1.5"
                style={{ background: dc?.bg ?? "#f3f4f6", color: dc?.text ?? "#374151" }}
              >
                {ds.degree}
                <span className="font-bold opacity-60">{ds.max_score}/14</span>
              </span>
            );
          })}
        </div>
      </div>

      <div ref={containerRef} className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-800">{formatSubject(s1.subject)}</span>
                    <span className="flex gap-0.5 shrink-0">
                      {pinColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.22)", boxShadow: `0 0 0 1.5px ${color}33` }}
                        >
                          <Pin size={13} fill="currentColor" style={{ color }} />
                        </span>
                      ))}
                    </span>
                  </div>
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
                            className="p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors shrink-0"
                            onClick={(e) => { e.stopPropagation(); const np = { ...picks, [i]: "" }; setPicks(np); setOpenSlot(null); refreshOpenPicks(np); }}
                          ><X size={14} strokeWidth={2.5} /></button>
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
                      {localOpenPicks.filter((pick) => {
                        if (pinnedSubjects.has(pick.subject)) return false;
                        const otherPicks = Object.entries(picks).filter(([k]) => Number(k) !== i).map(([, v]) => v);
                        return !otherPicks.includes(pick.subject);
                      }).map((pick) => (
                        <button
                          key={pick.subject}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between gap-2"
                          onClick={() => { const np = { ...picks, [i]: pick.subject }; setPicks(np); setOpenSlot(null); refreshOpenPicks(np); }}
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
                      {nonZeroWeights.map((w) => {
                        const dc = degreeColorMap[w.degree];
                        const isDouble = w.weight === 2;
                        return (
                          <span
                            key={w.degree}
                            className="text-xs px-1.5 py-0.5 rounded font-semibold capitalize"
                            style={{
                              background: isDouble ? (dc?.bgStrong ?? "#e5e7eb") : (dc?.bg ?? "#f3f4f6"),
                              color: dc?.text ?? "#374151",
                              boxShadow: isDouble ? `inset 0 0 0 1.5px ${dc?.text ?? "#374151"}44` : undefined,
                            }}
                          >
                            {w.degree} ×{w.weight}
                          </span>
                        );
                      })}
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
