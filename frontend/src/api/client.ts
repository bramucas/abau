const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface DegreePreference {
  rank: number;
  degree: string;
}

export interface Constraint {
  type:
    | "force_modality"
    | "exclude_modality"
    | "require_subject"
    | "exclude_subject";
  value: string;
}

export interface SolveRequest {
  preferences: DegreePreference[];
  constraints: Constraint[];
}

export interface SubjectEntry {
  course: "curso1" | "curso2";
  type: "oblig" | "opcion" | "optativa";
  subject: string;
}

export interface Plan {
  modality: string;
  subjects: SubjectEntry[];
  score: number | null;
}

export interface SolveResponse {
  plans: Plan[];
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const fetchDegrees = () => apiFetch<string[]>("/api/degrees/");

export const fetchModalities = () =>
  apiFetch<string[]>("/api/subjects/modalities");

export const fetchSubjects = () =>
  apiFetch<Record<string, string[]>>("/api/subjects/").then((grouped) =>
    [...new Set(Object.values(grouped).flat())].sort()
  );

export const postSolve = (req: SolveRequest) =>
  apiFetch<SolveResponse>("/api/solve/", {
    method: "POST",
    body: JSON.stringify(req),
  });
