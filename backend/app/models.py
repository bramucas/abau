from pydantic import BaseModel, Field
from typing import Literal


class DegreePreference(BaseModel):
    rank: int = Field(..., ge=1, description="Priority rank (1 = highest)")
    degree: str = Field(..., description="Degree name as it appears in the ASP data")


class Constraint(BaseModel):
    type: Literal["force_modality", "exclude_modality", "require_subject", "exclude_subject"]
    value: str


class SolveRequest(BaseModel):
    preferences: list[DegreePreference] = Field(..., min_length=1)
    constraints: list[Constraint] = Field(default_factory=list)


class WeightEntry(BaseModel):
    degree: str
    weight: int


class DegreeScore(BaseModel):
    degree: str
    max_score: float


class SubjectEntry(BaseModel):
    course: Literal["curso1", "curso2"]
    type: Literal["oblig", "opcion", "optativa"]
    subject: str
    weights: list[WeightEntry] = []
    depends_on: list[str] = []


class Plan(BaseModel):
    modality: str
    subjects: list[SubjectEntry]
    score: int | None = None
    degree_scores: list[DegreeScore] = []


class SolveResponse(BaseModel):
    plans: list[Plan]
