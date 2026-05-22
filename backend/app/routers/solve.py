import logging
from fastapi import APIRouter, HTTPException
from app.models import SolveRequest, SolveResponse
from app import solver

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/solve", tags=["solve"])


@router.post("/", response_model=SolveResponse)
async def solve_plan(request: SolveRequest) -> SolveResponse:
    logger.debug("solve request: %s", request.model_dump())
    result = solver.solve(request)
    if result is None:
        raise HTTPException(
            status_code=422,
            detail="No solution found for the given preferences and constraints.",
        )
    return result
