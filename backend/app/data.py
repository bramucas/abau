import re
from functools import lru_cache
from app.config import settings


def _parse_string_facts(filepath, predicate: str) -> list[str]:
    """Extract all string arguments from facts of the form predicate("value")."""
    pattern = rf'{predicate}\("([^"]+)"\)'
    content = filepath.read_text(encoding="utf-8")
    return re.findall(pattern, content)


@lru_cache(maxsize=1)
def get_degrees() -> list[str]:
    return sorted(_parse_string_facts(
        settings.asp_dir / "asp_data" / "degrees.lp",
        "degree",
    ))


@lru_cache(maxsize=1)
def get_modalities() -> list[str]:
    return _parse_string_facts(
        settings.asp_dir / "asp_data" / "database.lp",
        "modalidad",
    )


@lru_cache(maxsize=1)
def get_subjects() -> dict[str, list[str]]:
    """Return subjects grouped by course: {"curso1": [...], "curso2": [...]}."""
    subjects_lp = settings.asp_dir / "asp_data" / "subjects.lp"
    content = subjects_lp.read_text(encoding="utf-8")
    pattern = r'subject\((curso\d+)\s*,\s*"([^"]+)"\)'
    matches = re.findall(pattern, content)
    grouped: dict[str, list[str]] = {}
    for course, subject in matches:
        grouped.setdefault(course, []).append(subject)
    return grouped
