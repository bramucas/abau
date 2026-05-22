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

export interface WeightEntry {
  degree: string;
  weight: number;
}

export interface SubjectEntry {
  course: "curso1" | "curso2";
  type: "oblig" | "opcion" | "optativa";
  subject: string;
  weights: WeightEntry[];
}

export interface DegreeScore {
  degree: string;
  max_score: number;
}

export interface Plan {
  modality: string;
  subjects: SubjectEntry[];
  score: number | null;
  degree_scores: DegreeScore[];
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

export interface SubjectOption {
  subject: string;
  course: "curso1" | "curso2";
}

export const fetchSubjects = () =>
  apiFetch<Record<string, string[]>>("/api/subjects/").then((grouped) =>
    (Object.entries(grouped) as [SubjectOption["course"], string[]][])
      .flatMap(([course, subjects]) => subjects.map((subject) => ({ subject, course })))
      .sort((a, b) => a.subject.localeCompare(b.subject))
  );

export const postSolve = (req: SolveRequest) =>
  apiFetch<SolveResponse>("/api/solve/", {
    method: "POST",
    body: JSON.stringify(req),
  });
