import logging
import clingo
from app.config import settings
from app.models import Constraint, DegreePreference, DegreeScore, Plan, SolveRequest, SolveResponse, SubjectEntry, WeightEntry

logger = logging.getLogger(__name__)

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
    raw_subjects: list[tuple[str, str, str]] = []
    raw_weights: dict[str, list[WeightEntry]] = {}

    for atom in atoms:
        if atom.name == "s_mod" and len(atom.arguments) == 1:
            modality = str(atom.arguments[0]).strip('"')

        elif atom.name == "s" and len(atom.arguments) == 3:
            course = str(atom.arguments[0])
            kind = str(atom.arguments[1])
            subject = str(atom.arguments[2]).strip('"')
            raw_subjects.append((course, kind, subject))

        elif atom.name == "selected_weight" and len(atom.arguments) == 3:
            degree = str(atom.arguments[0]).strip('"')
            subject = str(atom.arguments[1]).strip('"')
            w = atom.arguments[2].number
            raw_weights.setdefault(subject, []).append(WeightEntry(degree=degree, weight=w))

    subjects = [
        SubjectEntry(course=course, type=kind, subject=subject, weights=raw_weights.get(subject, []))
        for course, kind, subject in raw_subjects
    ]

    degree_totals: dict[str, int] = {}
    for weights in raw_weights.values():
        for w in weights:
            degree_totals[w.degree] = degree_totals.get(w.degree, 0) + w.weight

    degree_scores = sorted(
        [
            DegreeScore(degree=d, max_score=10 + min(total, 4))
            for d, total in degree_totals.items()
        ],
        key=lambda x: x.max_score,
        reverse=True,
    )

    return Plan(modality=modality, subjects=subjects, score=score, degree_scores=degree_scores)


def solve(request: SolveRequest) -> SolveResponse | None:
    asp_dir = settings.asp_dir

    ctl = clingo.Control(["--opt-mode=optN", f"--models={MAX_OPTIMAL_MODELS}"])
    ctl.load(str(asp_dir / "abau_no_input.lp"))

    instance_lp = _build_instance_lp(request.preferences, request.constraints)
    logger.debug("instance_lp:\n%s", instance_lp)
    ctl.add("base", [], instance_lp)
    ctl.ground([("base", [])])
    logger.info("grounding done, solving...")

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
