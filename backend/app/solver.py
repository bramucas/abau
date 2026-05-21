import clingo
from app.config import settings
from app.models import Constraint, DegreePreference, Plan, SolveRequest, SolveResponse, SubjectEntry

MAX_OPTIMAL_MODELS = 5


def _build_instance_lp(
    preferences: list[DegreePreference],
    constraints: list[Constraint],
) -> str:
    lines: list[str] = []

    for pref in preferences:
        lines.append(f'orden({pref.rank}, "{pref.degree}").')

    for c in constraints:
        if c.type == "force_modality":
            lines.append(f':- not s_mod("{c.value}").')
        elif c.type == "exclude_modality":
            lines.append(f':- s_mod("{c.value}").')
        elif c.type == "require_subject":
            lines.append(f':- not s(_, "{c.value}").')
        elif c.type == "exclude_subject":
            lines.append(f':- s(_, "{c.value}").')

    return "\n".join(lines)


def _parse_plan(atoms: list[clingo.Symbol], score: int | None = None) -> Plan:
    modality: str = ""
    subjects: list[SubjectEntry] = []

    for atom in atoms:
        if atom.name == "s_mod" and len(atom.arguments) == 1:
            modality = str(atom.arguments[0]).strip('"')

        elif atom.name == "s" and len(atom.arguments) == 3:
            course = str(atom.arguments[0])
            kind = str(atom.arguments[1])
            subject = str(atom.arguments[2]).strip('"')
            subjects.append(SubjectEntry(course=course, type=kind, subject=subject))

    return Plan(modality=modality, subjects=subjects, score=score)


def solve(request: SolveRequest) -> SolveResponse | None:
    asp_dir = settings.asp_dir

    ctl = clingo.Control(["--opt-mode=optN", f"--models={MAX_OPTIMAL_MODELS}"])
    ctl.load(str(asp_dir / "abau.lp"))
    ctl.load(str(asp_dir / "optimize.lp"))
    ctl.load(str(asp_dir / "asp_data" / "database.lp"))

    instance_lp = _build_instance_lp(request.preferences, request.constraints)
    ctl.add("base", [], instance_lp)
    ctl.ground([("base", [])])

    candidates: list[tuple[list[int], list[clingo.Symbol]]] = []

    with ctl.solve(yield_=True) as handle:
        for model in handle:
            candidates.append((list(model.cost), list(model.symbols(atoms=True))))

    if not candidates:
        return None

    best_cost = min(candidates, key=lambda c: c[0])[0]
    optimal = [(cost, atoms) for cost, atoms in candidates if cost == best_cost]

    plans = [
        _parse_plan(atoms, score=(-cost[0]) if cost else None)
        for cost, atoms in optimal
    ]

    return SolveResponse(plans=plans)
