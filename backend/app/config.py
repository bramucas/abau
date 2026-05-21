from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="ABAU_", env_file=".env")

    asp_dir: Path = Path(__file__).parent.parent.parent / "abau_proj"
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False


settings = Settings()
