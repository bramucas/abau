from fastapi import APIRouter
from app.data import get_modalities, get_subjects

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("/modalities", response_model=list[str])
async def list_modalities() -> list[str]:
    return get_modalities()


@router.get("/", response_model=dict[str, list[str]])
async def list_subjects() -> dict[str, list[str]]:
    return get_subjects()
