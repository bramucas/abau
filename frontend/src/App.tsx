import { useState } from "react";
import { DegreePreference, SolveResponse } from "./api/client";
import InputPage from "./pages/InputPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const [result, setResult] = useState<{ preferences: DegreePreference[]; response: SolveResponse } | null>(null);

  if (result) {
    return <ResultsPage response={result.response} preferences={result.preferences} onBack={() => setResult(null)} />;
  }

  return <InputPage onSolve={(preferences, response) => setResult({ preferences, response })} />;
}
