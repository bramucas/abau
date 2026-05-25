import logging
from fastapi import APIRouter
from app.models import OpenPicksRequest, OpenPicksResponse
from app import solver

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/open-picks", tags=["open-picks"])


@router.post("/", response_model=OpenPicksResponse)
async def get_open_picks(request: OpenPicksRequest) -> OpenPicksResponse:
    logger.debug("open-picks request: modality=%s, curso1_fixed=%s", request.modality, request.curso1_fixed)
    return solver.solve_open_picks(request)
