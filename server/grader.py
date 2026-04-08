"""
ClaimLens — Deterministic Grader
Scores the final environment state on a 0.0–1.0 scale based on difficulty-specific criteria.
"""

from models import ScientificEnvState
from data.scenarios import get_scenario


def grade_episode(state: ScientificEnvState) -> dict:
    """
    Grade a completed episode. Returns a dict with:
    - total_score (float, 0.0–1.0)
    - breakdown (dict of component scores)
    - feedback (list of strings)
    """
    scenario = get_scenario(state.task_id)
    difficulty = scenario["difficulty"]
    expected_verdict = scenario["expected_verdict"]
    expected_conf_range = scenario["expected_confidence_range"]
    total_evidence_ids = [ev["id"] for ev in scenario["evidence"]]

    breakdown = {}
    feedback = []
    total_score = 0.0

    # ── Verdict accuracy ──
    correct_verdict = state.final_verdict == expected_verdict

    # ── Evidence coverage ──
    evaluated = set(state.evaluated_ids)
    total_ev = set(total_evidence_ids)
    coverage = len(evaluated & total_ev) / len(total_ev) if total_ev else 0.0

    # ── Confidence calibration ──
    confidence = state.final_confidence if state.final_confidence is not None else 0.5
    in_range = expected_conf_range[0] <= confidence <= expected_conf_range[1]

    # ════════════════════ Difficulty-specific grading ════════════════════

    if difficulty == "easy":
        # Easy: 0.8 verdict + 0.2 evidence coverage
        verdict_score = 0.8 if correct_verdict else 0.0
        evidence_score = 0.2 * coverage

        breakdown["verdict_accuracy"] = {"score": verdict_score, "max": 0.8}
        breakdown["evidence_coverage"] = {"score": evidence_score, "max": 0.2}

        total_score = verdict_score + evidence_score

        if correct_verdict:
            feedback.append("✅ Correct verdict identified.")
        else:
            feedback.append(
                f"❌ Incorrect verdict. Got '{state.final_verdict}', "
                f"expected '{expected_verdict}'."
            )
        if coverage >= 1.0:
            feedback.append("✅ All available evidence was evaluated.")
        else:
            feedback.append(
                f"⚠️ Only {int(coverage * 100)}% of evidence was evaluated."
            )

    elif difficulty == "medium":
        # Medium: 0.6 verdict + 0.2 evidence coverage + 0.2 confidence
        verdict_score = 0.6 if correct_verdict else 0.0
        evidence_score = 0.2 * coverage
        conf_score = 0.2 if (correct_verdict and in_range) else 0.0

        breakdown["verdict_accuracy"] = {"score": verdict_score, "max": 0.6}
        breakdown["evidence_coverage"] = {"score": evidence_score, "max": 0.2}
        breakdown["confidence_calibration"] = {"score": conf_score, "max": 0.2}

        total_score = verdict_score + evidence_score + conf_score

        if correct_verdict:
            feedback.append("✅ Correct verdict despite conflicting evidence.")
        else:
            feedback.append(
                f"❌ Incorrect verdict. Got '{state.final_verdict}', "
                f"expected '{expected_verdict}'."
            )
        if coverage >= 1.0:
            feedback.append("✅ All conflicting evidence items were evaluated.")
        else:
            feedback.append("⚠️ Not all conflicting evidence was reviewed.")

        if correct_verdict and in_range:
            feedback.append(f"✅ Confidence ({confidence:.0%}) is well-calibrated.")
        elif correct_verdict:
            feedback.append(
                f"⚠️ Confidence ({confidence:.0%}) outside expected range "
                f"[{expected_conf_range[0]:.0%}-{expected_conf_range[1]:.0%}]."
            )

    elif difficulty in ("hard", "custom"):
        # Hard/Custom: 0.5 verdict + 0.3 dataset evaluation + 0.2 uncertainty
        verdict_score = 0.5 if correct_verdict else 0.0

        # Check if dataset evidence was evaluated
        dataset_ids = [
            ev["id"] for ev in scenario["evidence"]
            if ev["type"] == "dataset_snippet"
        ]
        dataset_evaluated = all(did in evaluated for did in dataset_ids) if dataset_ids else True
        dataset_score = 0.3 if dataset_evaluated else 0.0

        # For custom: confidence-based uncertainty score
        uncertain = correct_verdict and confidence <= 0.65
        uncertainty_score = 0.2 if uncertain else 0.0

        breakdown["verdict_accuracy"]    = {"score": verdict_score,    "max": 0.5}
        breakdown["dataset_evaluation"]  = {"score": dataset_score,    "max": 0.3}
        breakdown["uncertainty_recognition"] = {"score": uncertainty_score, "max": 0.2}

        total_score = verdict_score + dataset_score + uncertainty_score

        if correct_verdict:
            feedback.append("✅ Correct verdict — saw through the misleading narrative.")
        else:
            feedback.append(
                f"❌ Incorrect verdict. The data contradicts the claim. "
                f"Got '{state.final_verdict}', expected '{expected_verdict}'."
            )
        if dataset_evaluated:
            feedback.append("✅ Raw dataset was evaluated (critical for this task).")
        else:
            feedback.append("❌ Raw dataset was NOT evaluated — this was essential.")

        if uncertain:
            feedback.append(
                f"✅ Appropriately calibrated confidence ({confidence:.0%})."
            )
        elif correct_verdict:
            feedback.append(
                f"⚠️ Consider a more conservative confidence for this evidence level."
            )

    return {
        "total_score": round(total_score, 3),
        "difficulty": difficulty,
        "breakdown": breakdown,
        "feedback": feedback,
        "correct_verdict": correct_verdict,
        "agent_verdict": state.final_verdict,
        "expected_verdict": expected_verdict,
        "agent_confidence": confidence,
        "expected_confidence_range": expected_conf_range,
    }
