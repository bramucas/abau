import { useState } from "react";
import { Constraint, DegreePreference, SolveResponse } from "./api/client";
import InputPage from "./pages/InputPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [result, setResult] = useState<{ preferences: DegreePreference[]; response: SolveResponse } | null>(null);

  if (result) {
    return <ResultsPage response={result.response} preferences={result.preferences} onBack={() => setResult(null)} />;
  }

  return (
    <InputPage
      selected={selected}
      onSelectedChange={setSelected}
      constraints={constraints}
      onConstraintsChange={setConstraints}
      onSolve={(preferences, response) => setResult({ preferences, response })}
    />
  );
}
