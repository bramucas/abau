from fastapi import APIRouter, HTTPException
from app.models import SolveRequest, SolveResponse
from app import solver

router = APIRouter(prefix="/solve", tags=["solve"])


@router.post("/", response_model=SolveResponse)
async def solve_plan(request: SolveRequest) -> SolveResponse:
    result = solver.solve(request)
    if result is None:
        raise HTTPException(
            status_code=422,
            detail="No solution found for the given preferences and constraints.",
        )
    return result
