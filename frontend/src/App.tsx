import { useState } from "react";
import { SolveResponse } from "./api/client";
import InputPage from "./pages/InputPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const [response, setResponse] = useState<SolveResponse | null>(null);

  if (response) {
    return <ResultsPage response={response} onBack={() => setResponse(null)} />;
  }

  return <InputPage onSolve={setResponse} />;
}
