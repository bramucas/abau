from app.data import get_degrees, get_modalities, get_subjects


def test_get_degrees_returns_list():
    degrees = get_degrees()
    assert isinstance(degrees, list)
    assert len(degrees) > 0


def test_get_degrees_are_sorted():
    degrees = get_degrees()
    assert degrees == sorted(degrees)


def test_get_degrees_contains_known_entries():
    degrees = get_degrees()
    assert "medicina" in degrees
    assert "enxeñaria informatica" in degrees
    assert "psicoloxia" in degrees


def test_get_modalities_returns_list():
    modalities = get_modalities()
    assert isinstance(modalities, list)
    assert len(modalities) > 0


def test_get_modalities_contains_known_entries():
    modalities = get_modalities()
    assert "ciencias" in modalities
    assert "humanidades" in modalities


def test_get_subjects_returns_dict():
    subjects = get_subjects()
    assert isinstance(subjects, dict)
    assert "curso1" in subjects
    assert "curso2" in subjects


def test_get_subjects_curso1_not_empty():
    subjects = get_subjects()
    assert len(subjects["curso1"]) > 0


def test_get_subjects_contains_known_entry():
    subjects = get_subjects()
    assert "matematicas_i" in subjects["curso1"]
    assert "bioloxia" in subjects["curso2"]
