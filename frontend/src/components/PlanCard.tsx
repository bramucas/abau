import { Plan, SubjectEntry } from "../api/client";

function formatSubject(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlanCard({ modality, subjects, score }: Plan) {
  const byCourse = (course: "curso1" | "curso2") =>
    subjects.filter((s) => s.course === course);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {(["curso1", "curso2"] as const).map((course) => (
          <div key={course}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {course === "curso1" ? "1º Bacharelato" : "2º Bacharelato"}
            </h4>
            <div className="space-y-3">
              {byCourse(course).map((s, i) => {
                const nonZeroWeights = s.weights.filter((w) => w.weight > 0);
                return (
                  <div key={i} className="flex flex-col gap-0.5">
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
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
