from app.models import Constraint, DegreePreference, SolveRequest
from app.solver import _build_instance_lp, solve


# ── _build_instance_lp unit tests ─────────────────────────────────────────────

def test_build_encodes_preferences():
    lp = _build_instance_lp(
        [DegreePreference(rank=1, degree="medicina"), DegreePreference(rank=2, degree="psicoloxia")],
        [],
    )
    assert 'orden(1, "medicina").' in lp
    assert 'orden(2, "psicoloxia").' in lp


def test_build_force_modality():
    lp = _build_instance_lp(
        [DegreePreference(rank=1, degree="medicina")],
        [Constraint(type="force_modality", value="ciencias")],
    )
    assert ':- not s_mod("ciencias").' in lp


def test_build_exclude_modality():
    lp = _build_instance_lp(
        [DegreePreference(rank=1, degree="medicina")],
        [Constraint(type="exclude_modality", value="humanidades")],
    )
    assert ':- s_mod("humanidades").' in lp


def test_build_require_subject():
    lp = _build_instance_lp(
        [DegreePreference(rank=1, degree="medicina")],
        [Constraint(type="require_subject", value="bioloxia")],
    )
    assert ':- not s(_, "bioloxia").' in lp


def test_build_exclude_subject():
    lp = _build_instance_lp(
        [DegreePreference(rank=1, degree="medicina")],
        [Constraint(type="exclude_subject", value="bioloxia")],
    )
    assert ':- s(_, "bioloxia").' in lp


def test_build_multiple_constraints():
    lp = _build_instance_lp(
        [DegreePreference(rank=1, degree="medicina")],
        [
            Constraint(type="force_modality", value="ciencias"),
            Constraint(type="exclude_subject", value="fisica"),
        ],
    )
    assert ':- not s_mod("ciencias").' in lp
    assert ':- s(_, "fisica").' in lp


def test_build_no_constraints_produces_only_orden():
    lp = _build_instance_lp(
        [DegreePreference(rank=1, degree="medicina")],
        [],
    )
    assert ":-" not in lp
    assert 'orden(1, "medicina").' in lp


# ── solver integration tests ───────────────────────────────────────────────────

def test_solve_returns_plans():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="medicina")],
        constraints=[],
    ))
    assert result is not None
    assert len(result.plans) > 0


def test_force_modality_respected():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="medicina")],
        constraints=[Constraint(type="force_modality", value="ciencias")],
    ))
    assert result is not None
    assert all(p.modality == "ciencias" for p in result.plans)


def test_exclude_modality_respected():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="medicina")],
        constraints=[Constraint(type="exclude_modality", value="ciencias")],
    ))
    assert result is not None
    assert all(p.modality != "ciencias" for p in result.plans)


def test_require_subject_respected():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="medicina")],
        constraints=[Constraint(type="require_subject", value="bioloxia")],
    ))
    assert result is not None
    assert all(
        "bioloxia" in {s.subject for s in p.subjects}
        for p in result.plans
    )


def test_exclude_subject_respected():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="medicina")],
        constraints=[Constraint(type="exclude_subject", value="bioloxia")],
    ))
    assert result is not None
    assert all(
        "bioloxia" not in {s.subject for s in p.subjects}
        for p in result.plans
    )


def test_dependency_returned_for_subject_with_dep():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="medicina")],
        constraints=[
            Constraint(type="force_modality", value="ciencias"),
            Constraint(type="require_subject", value="matematicas_ii"),
        ],
    ))
    assert result is not None
    mate2_entries = [
        s for p in result.plans for s in p.subjects if s.subject == "matematicas_ii"
    ]
    assert mate2_entries, "matematicas_ii not found in any plan"
    assert all("matematicas_i" in s.depends_on for s in mate2_entries)


def test_no_dependency_for_subject_without_dep():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="administracion e direccion de empresas")],
        constraints=[
            Constraint(type="require_subject", value="empresa_e_deseño_de_modelos_de_negocio"),
        ],
    ))
    assert result is not None
    empresa_entries = [
        s for p in result.plans for s in p.subjects
        if s.subject == "empresa_e_deseño_de_modelos_de_negocio"
    ]
    assert empresa_entries, "empresa_e_deseño_de_modelos_de_negocio not found in any plan"
    assert all(s.depends_on == [] for s in empresa_entries)


def test_conflicting_constraints_returns_none():
    result = solve(SolveRequest(
        preferences=[DegreePreference(rank=1, degree="medicina")],
        constraints=[
            Constraint(type="force_modality", value="ciencias"),
            Constraint(type="exclude_modality", value="ciencias"),
        ],
    ))
    assert result is None
