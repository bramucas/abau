import logging
from fastapi import FastAPI

logging.basicConfig(level=logging.INFO)
from fastapi.middleware.cors import CORSMiddleware
from app.routers import degrees, subjects, solve

app = FastAPI(
    title="abau API",
    description="Plan your Bacharelato subjects to maximise your ABAU score for a given degree.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(degrees.router, prefix="/api")
app.include_router(subjects.router, prefix="/api")
app.include_router(solve.router, prefix="/api")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
