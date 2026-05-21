import { Plan, SubjectEntry } from "../api/client";

const TYPE_LABELS: Record<SubjectEntry["type"], string> = {
  oblig: "oblig.",
  opcion: "opción",
  optativa: "optativa",
};

const TYPE_COLORS: Record<SubjectEntry["type"], string> = {
  oblig: "border border-blue-300 text-blue-500",
  opcion: "border border-emerald-300 text-emerald-600",
  optativa: "border border-amber-300 text-amber-600",
};

const TYPE_ORDER: Record<SubjectEntry["type"], number> = {
  oblig: 0,
  opcion: 1,
  optativa: 2,
};

function formatSubject(s: string): string {
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlanCard({ modality, subjects, score }: Plan) {
  const curso1 = subjects
    .filter((s) => s.course === "curso1")
    .sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);

  const curso2 = subjects
    .filter((s) => s.course === "curso2")
    .sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full capitalize">
          {modality}
        </span>
        {score !== null && (
          <span className="text-sm text-gray-500">
            Puntuación ABAU estimada:{" "}
            <span className="font-bold text-indigo-700">{score}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(
          [
            ["1º Bacharelato", curso1],
            ["2º Bacharelato", curso2],
          ] as [string, SubjectEntry[]][]
        ).map(([label, subjs]) => (
          <div key={label}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {label}
            </h4>
            <div className="space-y-2">
              {subjs.map((s, i) => {
                const nonZeroWeights = s.weights.filter((w) => w.weight > 0);
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatSubject(s.subject)}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[s.type]}`}
                      >
                        {TYPE_LABELS[s.type]}
                      </span>
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
