"""
ClaimLens — Pydantic Models
Typed contracts for Action, Observation, and State in the SCV environment.
"""

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ──────────────────────────── Enums ────────────────────────────

class ActionType(str, Enum):
    """Discrete actions the agent can take."""
    EVALUATE_EVIDENCE = "evaluate_evidence"
    UPDATE_NOTES = "update_notes"
    SET_VERDICT = "set_verdict"
    FINALIZE = "finalize"


class VerdictStatus(str, Enum):
    """Possible verdict states for a claim."""
    UNASSESSED = "unassessed"
    SUPPORTED = "supported"
    UNSUPPORTED = "unsupported"
    INCONCLUSIVE = "inconclusive"


class EvidenceType(str, Enum):
    """Types of evidence items."""
    PAPER_SUMMARY = "paper_summary"
    DATASET_SNIPPET = "dataset_snippet"
    TRIAL_OUTCOME = "trial_outcome"


# ──────────────────────────── Sub-Models ────────────────────────────

class EvidenceItem(BaseModel):
    """A single piece of evidence in the repository."""
    id: str
    type: EvidenceType
    title: str
    content: Optional[str] = None  # None until the agent evaluates it


class RewardEvent(BaseModel):
    """A single reward event in the step history."""
    step: int
    action: str
    delta: float
    reason: str


# ──────────────────────────── Action ────────────────────────────

class ScientificEnvAction(BaseModel):
    """Action submitted by the agent to the environment."""
    action_type: ActionType
    target_id: Optional[str] = Field(
        None, description="Evidence ID for evaluate_evidence"
    )
    content: Optional[str] = Field(
        None, description="Reasoning text for notes or verdict justification"
    )
    confidence: Optional[float] = Field(
        None, ge=0.0, le=1.0,
        description="Certainty score, required on finalize"
    )


# ──────────────────────────── Observation ────────────────────────────

class ScientificEnvObservation(BaseModel):
    """Observation returned by the environment after each step."""
    claim: str
    available_evidence: List[EvidenceItem]
    evaluated_evidence: Dict[str, str] = {}  # id -> full content
    agent_notes: str = ""
    current_status: VerdictStatus = VerdictStatus.UNASSESSED
    step_count: int = 0
    max_steps: int = 15
    reward: float = 0.0
    cumulative_reward: float = 0.0
    done: bool = False
    reward_history: List[RewardEvent] = []
    info: Dict[str, Any] = {}


# ──────────────────────────── State ────────────────────────────

class ScientificEnvState(BaseModel):
    """Internal state of the environment (for grading and debugging)."""
    task_id: str
    difficulty: str
    expected_verdict: str
    expected_confidence_range: List[float] = [0.0, 1.0]
    total_steps: int = 0
    cumulative_reward: float = 0.0
    is_done: bool = False
    evaluated_ids: List[str] = []
    final_verdict: Optional[str] = None
    final_confidence: Optional[float] = None
    final_justification: Optional[str] = None


# ──────────────────────────── API Request/Response ────────────────────────────

class ResetRequest(BaseModel):
    """Request body for /api/reset."""
    task_id: str = "easy_1"
    seed: Optional[int] = None


class StepRequest(BaseModel):
    """Request body for /api/step — wraps action."""
    action: ScientificEnvAction


class ScenarioInfo(BaseModel):
    """Lightweight scenario metadata for the UI picker."""
    task_id: str
    difficulty: str
    claim: str
    evidence_count: int
