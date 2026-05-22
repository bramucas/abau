import { useEffect, useState } from "react";
import {
  Constraint,
  fetchDegrees,
  fetchModalities,
  fetchSubjects,
  postSolve,
  SolveResponse,
  SubjectOption,
} from "../api/client";
import ConstraintPanel from "../components/ConstraintPanel";
import DegreeRanker from "../components/DegreeRanker";

interface Props {
  onSolve: (response: SolveResponse) => void;
}

export default function InputPage({ onSolve }: Props) {
  const [degrees, setDegrees] = useState<string[]>([]);
  const [modalities, setModalities] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDegrees().then(setDegrees).catch(console.error);
    fetchModalities().then(setModalities).catch(console.error);
    fetchSubjects().then(setSubjects).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const preferences = selected.map((degree, i) => ({
        rank: i + 1,
        degree,
      }));
      const response = await postSolve({ preferences, constraints });
      onSolve(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro descoñecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-900 tracking-tight mb-2">
            abau
          </h1>
          <p className="text-gray-500 text-sm">
            Elixe as túas materias de Bacharelato para acadar a carreira que
            desexas
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Carreiras que me interesan
          </h2>
          <DegreeRanker
            degrees={degrees}
            selected={selected}
            onChange={setSelected}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <ConstraintPanel
            modalities={modalities}
            subjects={subjects}
            constraints={constraints}
            onChange={setConstraints}
          />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={selected.length === 0 || loading}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
        >
          {loading ? "Calculando..." : "Calcular o meu plan →"}
        </button>
      </div>
    </div>
  );
}
