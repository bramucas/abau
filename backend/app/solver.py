import logging
import clingo
from app.config import settings
from app.models import Constraint, DegreePreference, DegreeScore, OpenPick, OpenPicksRequest, OpenPicksResponse, Plan, SolveRequest, SolveResponse, SubjectEntry, WeightEntry

logger = logging.getLogger(__name__)

MAX_OPTIMAL_MODELS = 5
_WEIGHT_BASE = 100
_WEIGHT_DECAY = 0.9


def _rank_to_weight(rank: int) -> int:
    """Convert a 1-based preference rank to an integer optimization weight.

    Rank 1 (most preferred) gets _WEIGHT_BASE; each subsequent rank is
    _WEIGHT_DECAY times the previous, so preferences are spaced ~10% apart.
    """
    return round(_WEIGHT_BASE * (_WEIGHT_DECAY ** (rank - 1)))


def _build_instance_lp(
    preferences: list[DegreePreference],
    constraints: list[Constraint],
) -> str:
    lines: list[str] = []

    for pref in preferences:
        lines.append(f'importancia({_rank_to_weight(pref.rank)}, "{pref.degree}").')

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
    raw_deps: dict[str, list[str]] = {}

    for atom in atoms:
        if atom.name == "s_mod" and len(atom.arguments) == 1:
            modality = str(atom.arguments[0]).strip('"')

        elif atom.name == "s" and len(atom.arguments) == 3:
            course = str(atom.arguments[0])
            kind = str(atom.arguments[1])
            subject = str(atom.arguments[2]).strip('"')
            raw_subjects.append((course, kind, subject))

        elif atom.name == "dependencia" and len(atom.arguments) == 2:
            s2 = str(atom.arguments[0]).strip('"')
            s1 = str(atom.arguments[1]).strip('"')
            raw_deps.setdefault(s2, []).append(s1)

        elif atom.name == "selected_weight" and len(atom.arguments) == 3:
            degree = str(atom.arguments[0]).strip('"')
            subject = str(atom.arguments[1]).strip('"')
            w = atom.arguments[2].number
            raw_weights.setdefault(subject, []).append(WeightEntry(degree=degree, weight=w))

    subjects = [
        SubjectEntry(
            course=course,
            type=kind,
            subject=subject,
            weights=raw_weights.get(subject, []),
            depends_on=raw_deps.get(subject, []) if course == "curso2" else [],
        )
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


def _solve_open_picks(
    preferences: list[DegreePreference],
    modality: str,
    curso2_subjects: list[str],
    curso1_fixed: list[str] = [],
) -> list[OpenPick]:
    asp_dir = settings.asp_dir

    ctl = clingo.Control(["--enum-mode=brave", "--models=0"])
    ctl.load(str(asp_dir / "abau_find_brave_cons.lp"))

    lines: list[str] = []
    for pref in preferences:
        lines.append(f'importancia({_rank_to_weight(pref.rank)}, "{pref.degree}").')
    lines.append(f':- not s_mod("{modality}").') 
    for subj in curso2_subjects:
        lines.append(f':- not s(curso2, "{subj}").')
    for subj in curso1_fixed:
        lines.append(f':- not s(curso1, "{subj}").')

    ctl.add("base", [], "\n".join(lines))
    ctl.ground([("base", [])])

    # In brave mode the final model IS the complete brave consequence set.
    last_atoms: list[clingo.Symbol] = []
    with ctl.solve(yield_=True) as handle:
        for model in handle:
            last_atoms = list(model.symbols(atoms=True))

    raw: dict[str, list[str]] = {}
    for atom in last_atoms:
        if atom.name == "open_pick" and len(atom.arguments) == 2:
            subject = str(atom.arguments[0]).strip('"')
            kind = str(atom.arguments[1])
            raw.setdefault(subject, []).append(kind)

    open_picks = [OpenPick(subject=s, types=t) for s, t in raw.items()]

    logger.debug("open_picks for %s: %d", curso2_subjects, len(open_picks))
    return open_picks


def solve(request: SolveRequest) -> SolveResponse | None:
    asp_dir = settings.asp_dir

    ctl = clingo.Control(["--opt-mode=optN", f"--models={MAX_OPTIMAL_MODELS}", "--project=auto"])
    ctl.load(str(asp_dir / "abau_optimize_2nd_course.lp"))

    instance_lp = _build_instance_lp(request.preferences, request.constraints)
    logger.debug("instance_lp:\n%s", instance_lp)
    ctl.add("base", [], instance_lp)
    ctl.ground([("base", [])])
    logger.info("grounding done, solving...")

    optimal_plans: list[tuple[list[int], list[clingo.Symbol]]] = []

    with ctl.solve(yield_=True) as handle:
        for model in handle:
            if model.optimality_proven:
                optimal_plans.append((list(model.cost), list(model.symbols(atoms=True))))

    if not optimal_plans:
        logger.debug('no valid plan found')
        return None

    logger.debug(f'optimal plans: {len(optimal_plans)}')

    plans = [
        _parse_plan(atoms, score=(-cost[0]) if cost else None)
        for cost, atoms in optimal_plans
    ]

    for plan in plans:
        curso2_subjects = [s.subject for s in plan.subjects if s.course == "curso2"]
        plan.open_picks = _solve_open_picks(request.preferences, plan.modality, curso2_subjects)

    return SolveResponse(plans=plans)


def solve_open_picks(request: OpenPicksRequest) -> OpenPicksResponse:
    picks = _solve_open_picks(
        request.preferences,
        request.modality,
        request.curso2_subjects,
        request.curso1_fixed,
    )
    return OpenPicksResponse(open_picks=picks)
