import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { DegreePreference, SolveResponse } from "../api/client";
import PlanCard from "../components/PlanCard";

interface Props {
  response: SolveResponse;
  preferences: DegreePreference[];
  onBack: () => void;
}

export default function ResultsPage({ response, preferences, onBack }: Props) {
  const [active, setActive] = useState(0);
  const { plans } = response;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={onBack}
            className="mt-1 flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors shrink-0"
          >
            <ArrowLeft size={15} /> Volver
          </button>
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">
              O teu plan de Bacharelato
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {plans.length} plan{plans.length !== 1 ? "s" : ""} óptimo
              {plans.length !== 1 ? "s" : ""} atopado
              {plans.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {plans.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active === i
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-500 hover:bg-indigo-50 border border-gray-200"
                }`}
              >
                Plan {i + 1}
              </button>
            ))}
          </div>
        )}

        <PlanCard key={active} {...plans[active]} preferences={preferences} />
      </div>
    </div>
  );
}
