from fastapi import APIRouter
from app.data import get_degrees

router = APIRouter(prefix="/degrees", tags=["degrees"])


@router.get("/", response_model=list[str])
async def list_degrees() -> list[str]:
    return get_degrees()
