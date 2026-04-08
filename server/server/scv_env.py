"""
ClaimLens — Core Environment Logic
Implements the scientific claim verification environment with dense reward shaping.
"""

from typing import Optional

from models import (
    ActionType,
    EvidenceItem,
    EvidenceType,
    RewardEvent,
    ScientificEnvAction,
    ScientificEnvObservation,
    ScientificEnvState,
    VerdictStatus,
)
from data.scenarios import get_scenario


class ScientificClaimVerificationEnv:
    """
    OpenEnv-compliant environment for scientific claim verification.

    The agent evaluates evidence, builds reasoning, and outputs a calibrated verdict.
    """

    MAX_STEPS = 15

    def __init__(self):
        self._scenario = None
        self._observation = None
        self._state = None
        self._evidence_store = {}  # id -> full_content (hidden until evaluated)
        self._reward_history = []

    # ──────────────────── Public API ────────────────────

    def reset(self, task_id: str = "easy_1", seed: Optional[int] = None) -> ScientificEnvObservation:
        """Reset the environment with a new scenario."""
        scenario = get_scenario(task_id)
        self._scenario = scenario

        # Build evidence store (agent can't see content until they evaluate)
        self._evidence_store = {}
        available_evidence = []
        for ev in scenario["evidence"]:
            self._evidence_store[ev["id"]] = ev["full_content"]
            available_evidence.append(
                EvidenceItem(
                    id=ev["id"],
                    type=EvidenceType(ev["type"]),
                    title=ev["title"],
                    content=None,  # Hidden
                )
            )

        self._reward_history = []

        self._observation = ScientificEnvObservation(
            claim=scenario["claim"],
            available_evidence=available_evidence,
            evaluated_evidence={},
            agent_notes="",
            current_status=VerdictStatus.UNASSESSED,
            step_count=0,
            max_steps=self.MAX_STEPS,
            reward=0.0,
            cumulative_reward=0.0,
            done=False,
            reward_history=[],
            info={"task_id": task_id, "difficulty": scenario["difficulty"]},
        )

        self._state = ScientificEnvState(
            task_id=task_id,
            difficulty=scenario["difficulty"],
            expected_verdict=scenario["expected_verdict"],
            expected_confidence_range=scenario["expected_confidence_range"],
            total_steps=0,
            cumulative_reward=0.0,
            is_done=False,
            evaluated_ids=[],
        )

        return self._observation

    def step(self, action: ScientificEnvAction) -> ScientificEnvObservation:
        """Execute an action and return the new observation."""
        if self._observation is None:
            raise RuntimeError("Environment not initialized. Call reset() first.")

        if self._observation.done:
            raise RuntimeError("Episode is finished. Call reset() to start a new one.")

        step_reward = 0.0
        reason = ""

        # ── Process action ──
        if action.action_type == ActionType.EVALUATE_EVIDENCE:
            step_reward, reason = self._handle_evaluate(action)

        elif action.action_type == ActionType.UPDATE_NOTES:
            step_reward, reason = self._handle_update_notes(action)

        elif action.action_type == ActionType.SET_VERDICT:
            step_reward, reason = self._handle_set_verdict(action)

        elif action.action_type == ActionType.FINALIZE:
            step_reward, reason = self._handle_finalize(action)

        # ── Update observation ──
        self._state.total_steps += 1
        self._state.cumulative_reward += step_reward
        self._observation.step_count = self._state.total_steps
        self._observation.reward = step_reward
        self._observation.cumulative_reward = self._state.cumulative_reward

        reward_event = RewardEvent(
            step=self._state.total_steps,
            action=action.action_type.value,
            delta=step_reward,
            reason=reason,
        )
        self._reward_history.append(reward_event)
        self._observation.reward_history = list(self._reward_history)

        # Check max steps
        if self._state.total_steps >= self.MAX_STEPS and not self._observation.done:
            self._observation.done = True
            self._state.is_done = True
            self._observation.info["termination"] = "max_steps_reached"

        return self._observation

    @property
    def state(self) -> ScientificEnvState:
        """Return the current internal state."""
        if self._state is None:
            raise RuntimeError("Environment not initialized. Call reset() first.")
        return self._state

    @property
    def observation(self) -> ScientificEnvObservation:
        """Return the current observation."""
        if self._observation is None:
            raise RuntimeError("Environment not initialized. Call reset() first.")
        return self._observation

    # ──────────────────── Action Handlers ────────────────────

    def _handle_evaluate(self, action: ScientificEnvAction) -> tuple:
        """Handle evaluate_evidence action."""
        target_id = action.target_id
        if not target_id:
            return -0.05, "No target_id provided for evaluate_evidence"

        if target_id not in self._evidence_store:
            return -0.05, f"Evidence '{target_id}' does not exist"

        if target_id in self._observation.evaluated_evidence:
            return -0.05, f"Evidence '{target_id}' already evaluated (redundant)"

        # Reveal the evidence
        full_content = self._evidence_store[target_id]
        self._observation.evaluated_evidence[target_id] = full_content
        self._state.evaluated_ids.append(target_id)

        # Update the available_evidence to show content
        for ev in self._observation.available_evidence:
            if ev.id == target_id:
                ev.content = full_content
                break

        return 0.1, f"Successfully evaluated evidence '{target_id}'"

    def _handle_update_notes(self, action: ScientificEnvAction) -> tuple:
        """Handle update_notes action."""
        content = action.content
        if not content or len(content.strip()) < 10:
            return -0.05, "Notes content too short or empty (redundant)"

        self._observation.agent_notes += f"\n[Step {self._state.total_steps + 1}] {content}"
        return 0.0, "Notes updated"

    def _handle_set_verdict(self, action: ScientificEnvAction) -> tuple:
        """Handle set_verdict action."""
        content = action.content
        if not content:
            return -0.05, "No verdict provided"

        verdict_map = {
            "supported": VerdictStatus.SUPPORTED,
            "unsupported": VerdictStatus.UNSUPPORTED,
            "inconclusive": VerdictStatus.INCONCLUSIVE,
            "accept_claim": VerdictStatus.SUPPORTED,
            "reject_claim": VerdictStatus.UNSUPPORTED,
            "mark_uncertain": VerdictStatus.INCONCLUSIVE,
        }

        verdict_key = content.lower().strip()
        if verdict_key not in verdict_map:
            return -0.05, f"Invalid verdict '{content}'. Use: supported, unsupported, inconclusive"

        self._observation.current_status = verdict_map[verdict_key]
        return 0.0, f"Verdict set to '{self._observation.current_status.value}'"

    def _handle_finalize(self, action: ScientificEnvAction) -> tuple:
        """Handle finalize action. Computes terminal rewards."""
        # Penalty for finalizing without evidence
        if not self._state.evaluated_ids:
            self._observation.done = True
            self._state.is_done = True
            return -0.1, "Finalized without evaluating any evidence"

        # Must have a verdict
        if self._observation.current_status == VerdictStatus.UNASSESSED:
            self._observation.done = True
            self._state.is_done = True
            return -0.1, "Finalized without setting a verdict"

        confidence = action.confidence if action.confidence is not None else 0.5
        self._state.final_verdict = self._observation.current_status.value
        self._state.final_confidence = confidence
        self._state.final_justification = action.content or ""

        # ── Terminal reward calculation ──
        expected = self._scenario["expected_verdict"]
        actual = self._observation.current_status.value
        conf_range = self._scenario["expected_confidence_range"]

        terminal_reward = 0.0
        reason_parts = []

        # Correct verdict: +0.6
        if actual == expected:
            terminal_reward += 0.6
            reason_parts.append(f"+0.6 correct verdict ({actual})")
        else:
            reason_parts.append(f"+0.0 incorrect verdict (got {actual}, expected {expected})")

        # Confidence calibration: +0.2
        if actual == expected:
            if conf_range[0] <= confidence <= conf_range[1]:
                terminal_reward += 0.2
                reason_parts.append(f"+0.2 well-calibrated confidence ({confidence:.2f})")
            else:
                # Partial credit: closer to range = more reward
                dist = min(abs(confidence - conf_range[0]), abs(confidence - conf_range[1]))
                partial = max(0.0, 0.2 - dist * 0.4)
                terminal_reward += partial
                reason_parts.append(
                    f"+{partial:.2f} partially calibrated confidence "
                    f"({confidence:.2f}, expected [{conf_range[0]:.1f}-{conf_range[1]:.1f}])"
                )

        self._observation.done = True
        self._state.is_done = True
        self._observation.info["terminal_breakdown"] = reason_parts

        return terminal_reward, "; ".join(reason_parts)
