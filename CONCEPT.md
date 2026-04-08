# ClaimLens — Scientific Claim Verification Environment
### Concept, Architecture & User Guide

---

## Table of Contents

1. [What Is ClaimLens?](#1-what-is-claimlens)
2. [Why It Exists](#2-why-it-exists)
3. [How the Application Works](#3-how-the-application-works)
4. [Tech Stack](#4-tech-stack)
5. [Project Architecture](#5-project-architecture)
6. [The OpenEnv Interface](#6-the-openenv-interface)
7. [Scientific Scenarios](#7-scientific-scenarios)
8. [Reward System](#8-reward-system)
9. [Grading System](#9-grading-system)
10. [How to Use the UI](#10-how-to-use-the-ui)
11. [AI Auto-Play Mode](#11-ai-auto-play-mode)
12. [Running Locally](#12-running-locally)
13. [Baseline Agent (inference.py)](#13-baseline-agent-inferencepy)
14. [Deployment (Docker)](#14-deployment-docker)
15. [File Reference](#15-file-reference)

---

## 1. What Is ClaimLens?

**ClaimLens** is an interactive, full-stack **scientific claim verification environment** built on the [OpenEnv](https://github.com/meta-pytorch/OpenEnv) specification.

It models the real-world workflow of a **scientific peer reviewer** or **fact-checker**: given a specific scientific claim and a curated set of evidence items (paper abstracts, clinical trial results, statistical datasets), you — or an AI agent — must:

1. Browse and **evaluate** the available evidence
2. Build a **reasoning trace** via a scratchpad
3. Form a **verdict**: `Supported`, `Unsupported`, or `Inconclusive`
4. Submit a **calibrated confidence score** (0–100%)
5. Receive a **deterministic grade** (0.0–1.0) evaluating the quality of the analysis

The environment is designed for both **human use** (interactive UI) and **AI agent benchmarking** (the inference script).

---

## 2. Why It Exists

### The Problem

Large Language Models frequently:
- **Hallucinate** scientific citations that don't exist
- **Misinterpret** statistical results (e.g., conflating p-values with effect sizes)
- **Fail to detect** retracted papers, predatory journals, or conflicting evidence
- **Over-claim** certainty when evidence is ambiguous

Human fact-checkers are overwhelmed by the sheer volume of publications (over 2 million peer-reviewed papers published per year).

### The Solution

ClaimLens provides a **structured, game-like environment** where an agent must:
- Navigate a repository of evidence with limited visibility (items are initially locked)
- Take **sequential actions** that incrementally reveal information
- Be **rewarded** for good epistemic practices and **penalized** for lazy shortcuts
- Produce a **calibrated verdict** — getting the right answer with the right confidence level

This maps directly to real-world tasks in **AI safety**, **medical review**, **drug approval processes**, and **science policy**.

---

## 3. How the Application Works

ClaimLens operates as a **turn-based episode**:

```
┌─────────────────────────────────────────────────────────────┐
│                      EPISODE LIFECYCLE                       │
│                                                              │
│  Reset(task_id)  →  Initial Observation                      │
│       ↓                                                      │
│  Step(action)    →  New Observation + Reward                 │
│       ↓                (repeat up to 15 times)               │
│  Finalize()      →  Terminal Reward + Grade (0.0–1.0)        │
└─────────────────────────────────────────────────────────────┘
```

### Episode Phases

| Phase | Description |
|-------|-------------|
| **Initialization** | A scenario is loaded. The claim is displayed. Evidence titles are visible, but content is hidden (locked 🔒). |
| **Investigation** | The agent/user evaluates evidence items one by one, unlocking their full text. Notes are taken. |
| **Deliberation** | Based on the reviewed evidence, a verdict stance is set (Supported / Unsupported / Inconclusive). |
| **Finalization** | The verdict is submitted with a confidence score. The episode ends and a grader scores the analysis. |

### State Persistence

The environment maintains full state server-side. Every call to `/api/step` returns a complete `ScientificEnvObservation` object, meaning the frontend is always fully in sync with the backend.

---

## 4. Tech Stack

### Backend

| Technology | Role |
|------------|------|
| **Python 3.10** | Core language for the environment logic |
| **FastAPI** | Async REST API server with OpenAPI docs |
| **Pydantic v2** | Typed data contracts for Action, Observation, State |
| **Uvicorn** | ASGI server to run FastAPI |
| **httpx** | HTTP client used in the inference agent |
| **openai (Python)** | Client for calling LLM-based inference via HF or OpenAI |

### Frontend

| Technology | Role |
|------------|------|
| **React 18** | Component-based UI framework |
| **Vite** | Lightning-fast build tool and dev server |
| **TailwindCSS v3** | Utility-first CSS framework |
| **Lucide React** | SVG icon library |
| **Axios** | HTTP client for backend API calls |
| **Custom CSS** | Glassmorphism effects, animations, scrollbar theming |

### Infrastructure

| Technology | Role |
|------------|------|
| **Docker** | Containerization of the backend |
| **Docker Compose** | Orchestration of backend + frontend together |

---

## 5. Project Architecture

```
SCV-ENV/
│
├── backend/                         Python FastAPI Environment
│   ├── models.py                    Pydantic data models (Action, Observation, State)
│   ├── grader.py                    Deterministic grading logic (0.0–1.0)
│   ├── inference.py                 Baseline LLM agent with OpenAI client
│   ├── openenv.yaml                 OpenEnv environment manifest
│   ├── requirements.txt             Python dependencies
│   ├── Dockerfile                   Container definition
│   │
│   ├── data/
│   │   └── scenarios.py             10 curated scientific scenarios
│   │
│   └── server/
│       ├── scv_env.py               Core environment (reset, step, state)
│       └── app.py                   FastAPI routes + CORS + auto-play logic
│
├── frontend/                        React + Vite + TailwindCSS
│   ├── index.html                   HTML entry point
│   ├── vite.config.js               Dev server + proxy to backend
│   ├── tailwind.config.js           Design tokens (colors, fonts, animations)
│   │
│   └── src/
│       ├── main.jsx                 React app entry point
│       ├── App.jsx                  Root layout (3-column desktop, tab mobile)
│       ├── index.css                Global styles + Tailwind layers
│       │
│       ├── api/
│       │   └── envClient.js         Axios HTTP client for all API calls
│       │
│       ├── hooks/
│       │   └── useEnvironment.js    Central state manager React hook
│       │
│       └── components/
│           ├── Header.jsx           Top nav: logo, scenario picker, controls
│           ├── ClaimCard.jsx        Displays the current scientific claim
│           ├── EvidencePanel.jsx    Scrollable evidence browser (locked/unlocked)
│           ├── EvidenceDetail.jsx   Modal to view full evidence content
│           ├── ActionBar.jsx        4 action buttons with smart recommendations
│           ├── Scratchpad.jsx       Agent reasoning notes editor
│           ├── VerdictPanel.jsx     Verdict buttons + confidence slider + finalize
│           ├── RewardTracker.jsx    Live reward accumulation chart
│           ├── StepTimeline.jsx     Per-action timeline with reward deltas
│           ├── GraderResult.jsx     Final score overlay with animated ring
│           └── AutoPlayModal.jsx    AI auto-play status and controls
│
├── docker-compose.yml               Orchestrates backend + frontend
├── README.md                        Quick start guide
└── CONCEPT.md                       This file
```

---

## 6. The OpenEnv Interface

ClaimLens follows the OpenEnv specification, implementing a **Gymnasium-style** API with three core methods:

### `reset(task_id)` → `ScientificEnvObservation`

Loads a scenario, hides all evidence content, and returns the initial observation.

### `step(action)` → `ScientificEnvObservation`

Executes one action and returns a new observation with the updated state and reward for that step.

### `state` → `ScientificEnvState`

Returns the internal state of the environment including the expected verdict (used for grading).

### Pydantic Models

All data is strongly typed using Pydantic:

```python
# What the agent sends:
class ScientificEnvAction(BaseModel):
    action_type: ActionType           # evaluate_evidence | update_notes | set_verdict | finalize
    target_id: Optional[str]          # evidence ID to evaluate
    content: Optional[str]            # note text or verdict keyword
    confidence: Optional[float]       # 0.0–1.0, required on finalize

# What the agent receives:
class ScientificEnvObservation(BaseModel):
    claim: str                        # The scientific claim to verify
    available_evidence: List[EvidenceItem]  # All evidence (content hidden until evaluated)
    evaluated_evidence: Dict[str, str]      # Unlocked evidence content
    agent_notes: str                        # The scratchpad
    current_status: VerdictStatus          # unassessed|supported|unsupported|inconclusive
    step_count: int                         # Actions taken so far
    max_steps: int                          # Episode limit (15)
    reward: float                           # Reward for the last action
    cumulative_reward: float                # Total reward so far
    done: bool                              # Is the episode over?
    reward_history: List[RewardEvent]       # Per-step reward log
```

---

## 7. Scientific Scenarios

ClaimLens includes **10 hand-crafted scientific scenarios** across three difficulty levels. All evidence is **realistic mock data** — no copyrighted material.

### Easy (4 scenarios) — Single clear evidence

| ID | Claim | Expected Verdict |
|----|-------|-----------------|
| `easy_1` | "Vitamin C supplementation cures viral infections" | `unsupported` |
| `easy_2` | "Low-dose aspirin reduces cardiovascular events in high-risk patients" | `supported` |
| `easy_3` | "Homeopathic remedies are more effective than placebo" | `unsupported` |
| `easy_4` | "Regular exercise reduces the risk of type 2 diabetes" | `supported` |

### Medium (3 scenarios) — Conflicting evidence requiring quality assessment

| ID | Claim | Expected Verdict |
|----|-------|-----------------|
| `medium_1` | "Mediterranean diet reduces Alzheimer's disease risk" | `supported` |
| `medium_2` | "5G radiation causes cancer" | `unsupported` |
| `medium_3` | "Intermittent fasting extends human lifespan" | `inconclusive` |

> The medium difficulty includes a **retracted paper** (medium_1) and a **predatory journal** (medium_2). The agent must identify and discount these.

### Hard (3 scenarios) — Statistical reasoning required

| ID | Claim | Expected Verdict |
|----|-------|-----------------|
| `hard_1` | "Drug X significantly reduces tumor growth" | `unsupported` |
| `hard_2` | "Vaccine Y prevents 95% of infections" | `inconclusive` |
| `hard_3` | "Gene therapy Z reverses aging markers" | `inconclusive` |

> Hard scenarios are specifically designed to **trick the agent**. The narrative summary sounds positive, but the raw dataset reveals p-values above 0.05, impossibly small sample sizes (n=20), and uncontrolled confounders.

---

## 8. Reward System

The reward function is **dense** — meaning the agent receives feedback at every step, not just at the end.

### Step Rewards

| Action | Condition | Reward |
|--------|-----------|--------|
| `evaluate_evidence` | New evidence, not yet read | **+0.10** |
| `evaluate_evidence` | Evidence already evaluated | **−0.05** |
| `evaluate_evidence` | Invalid evidence ID | **−0.05** |
| `update_notes` | Meaningful note (≥10 chars) | **0.00** |
| `update_notes` | Empty or trivial note | **−0.05** |
| `set_verdict` | Any valid verdict | **0.00** |
| `set_verdict` | Invalid verdict keyword | **−0.05** |
| `finalize` | Without reading any evidence | **−0.10** |
| `finalize` | Without setting a verdict | **−0.10** |

### Terminal Rewards (on finalize)

| Condition | Reward |
|-----------|--------|
| Correct final verdict | **+0.60** |
| Incorrect final verdict | **+0.00** (no bonus) |
| Confidence in expected range | **+0.20** |
| Confidence partially in range | **+0.00 to +0.20** (partial) |

**Maximum possible episode reward:** `n × 0.10 + 0.60 + 0.20` where `n` = number of evidence items.

---

## 9. Grading System

After `finalize`, the grader computes a **0.0–1.0 score** using difficulty-specific criteria.

### Easy Grading

| Component | Points | Criteria |
|-----------|--------|----------|
| Verdict accuracy | 0.80 | Correct verdict |
| Evidence coverage | 0.20 | All evidence evaluated |

### Medium Grading

| Component | Points | Criteria |
|-----------|--------|----------|
| Verdict accuracy | 0.60 | Correct verdict |
| Evidence coverage | 0.20 | All conflicting items reviewed |
| Confidence calibration | 0.20 | Confidence ≥ 0.80 for clear verdicts |

### Hard Grading

| Component | Points | Criteria |
|-----------|--------|----------|
| Verdict accuracy | 0.50 | Correct verdict |
| Dataset evaluation | 0.30 | Raw dataset evidence was read |
| Uncertainty recognition | 0.20 | Confidence ≤ 0.50 (appropriately uncertain) |

> The **hard grading** specifically rewards reading the dataset — because in hard scenarios, the narrative summary is misleading and only the raw numbers reveal the truth.

---

## 10. How to Use the UI

### Step 1 — Select a Scenario

In the **top navigation bar**, use the dropdown to select a scenario. Scenarios are grouped by difficulty (Easy / Medium / Hard) with color-coded badges.

### Step 2 — Reset

Click **Reset** to initialize the environment. This loads the selected scenario and shows the scientific claim with all evidence locked.

### Step 3 — Review the Claim

The **Claim Card** in the center column shows the scientific statement you must verify, your current verdict status, and the episode progress bar.

### Step 4 — Evaluate Evidence

In the **Evidence Panel** (left column), you'll see all available evidence items labeled with their type:
- 📄 **Paper** = research paper abstract or review
- 📊 **Dataset** = raw statistical data (tables, p-values, confidence intervals)
- 🧪 **Trial** = clinical trial outcome summary

Click any **locked** item to evaluate it. This costs one step and reveals the full content. Click an already-evaluated item to view its contents again.

### Step 5 — Take Notes

In the **Scratchpad** (center column), write your reasoning as you go. Press `Ctrl+Enter` or click **Save Notes** to submit them. Good notes help you reason through contradictions.

### Step 6 — Set Your Verdict

In the **Verdict Panel** (right column), click one of three verdict buttons:
- ✅ **Supported** — Evidence clearly supports the claim
- ❌ **Unsupported** — Evidence contradicts or fails to support the claim
- ❓ **Inconclusive** — Evidence is mixed, insufficient, or statistically weak

Then adjust the **Confidence Slider** (0–100%) to reflect how certain you are.

### Step 7 — Finalize

Click **Finalize Verdict**. A confirmation dialog will ask you to confirm your verdict and confidence. Once confirmed, the episode ends and the **Grader Result** overlay appears showing your score.

### Reading the Grader Result

The animated **score ring** shows your 0–100 grade. Below it you'll see:
- Your verdict vs. the expected verdict
- A breakdown of points earned per component
- Specific feedback about what you did well or missed

---

## 11. AI Auto-Play Mode

ClaimLens includes a built-in **AI Auto-Play** mode. When activated, a deterministic algorithm (located in `backend/server/app.py → _compute_auto_action`) automatically plays through the episode.

### How the Auto-Play Agent Works

The auto-play agent follows a simple sequential strategy:

1. **Evaluate** every piece of evidence one by one (in order)
2. **Update Notes** with a summary of what was reviewed
3. **Set Verdict** by scanning for keywords in the evidence:
   - "not statistically significant" → `unsupported`
   - "retracted" + no strong counter-evidence → `unsupported`
   - "meta-analysis" with positive effect size → `supported`
   - "impossible to attribute" or "small sample" → `inconclusive`
4. **Finalize** with a confidence score calibrated to the evidence quality

### To Activate Auto-Play

1. Select a scenario and click **Reset**
2. Click the **AI Auto-Play** button in the header
3. In the modal, click **Start Auto-Play**
4. Watch the Step Timeline update in real-time as the agent works through the evidence
5. Click **Stop Agent** at any time to pause

The agent pauses 1.2 seconds between each step so you can follow the reasoning.

---

## 12. Running Locally

### Prerequisites

- **Python 3.10+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)

### Backend Setup

Open a terminal in the project root (`SCV-ENV/`):

```powershell
# Create virtual environment
cd backend
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the server (from the project ROOT, not inside /backend)
cd ..
.\backend\venv\Scripts\python.exe -m uvicorn backend.server.app:app --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**
Interactive API docs: **http://localhost:8000/docs**

### Frontend Setup

Open a **second terminal** in `SCV-ENV/frontend/`:

```bash
# Install npm packages
npm install

# Start the dev server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

> The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:8000`, so no CORS issues during development.

---

## 13. Baseline Agent (inference.py)

`backend/inference.py` implements a **real LLM-based agent** using the OpenAI Python client. It is designed to work with any OpenAI-compatible endpoint, including Hugging Face Inference API.

### Configuration

Set the following environment variables before running:

| Variable | Default | Description |
|----------|---------|-------------|
| `HF_TOKEN` | `""` | Hugging Face API token |
| `MODEL_NAME` | `meta-llama/Llama-3-70B-Instruct` | The LLM model to use |
| `API_BASE_URL` | `http://localhost:8000` | ClaimLens backend URL |
| `OPENAI_BASE_URL` | `https://api-inference.huggingface.co/v1` | LLM API base URL |

### Running the Agent

```bash
# Run on a single scenario
cd backend
.\venv\Scripts\python.exe inference.py easy_1

# Run on multiple scenarios
.\venv\Scripts\python.exe inference.py easy_1 medium_2 hard_1
```

### Stdout Logging Format

The agent emits structured logs matching the OpenEnv competition spec:

```
[START] task_id=easy_1
[STEP] action=evaluate_evidence target=ev_e1_1
[STEP] action=update_notes content="Cochrane Review confirms Vitamin C does not cure..."
[STEP] action=set_verdict content="unsupported"
[STEP] action=finalize confidence=0.9 content="Strong Cochrane meta-analysis."
[END] verdict=unsupported score=0.950
```

---

## 14. Deployment (Docker)

### Building and Running with Docker Compose

```bash
# From the project root
docker-compose up --build
```

This starts:
- **Backend** container on port `8000` (mapped from container's `7860`)
- **Frontend** via Node.js on port `5173`

### Hugging Face Space Deployment

The `backend/Dockerfile` is configured for Hugging Face Spaces (port `7860`):

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["uvicorn", "server.app:app", "--host", "0.0.0.0", "--port", "7860"]
```

Tag your HF Space with `openenv` for competition submission.

---

## 15. File Reference

| File | Purpose |
|------|---------|
| `backend/models.py` | All Pydantic type definitions |
| `backend/data/scenarios.py` | All 10 scientific scenarios with full evidence text |
| `backend/server/scv_env.py` | `reset()`, `step()`, `state` — core environment logic |
| `backend/server/app.py` | FastAPI routes including `/api/auto-step` |
| `backend/grader.py` | Deterministic 0.0–1.0 scoring per difficulty |
| `backend/inference.py` | Standalone LLM agent with OpenEnv logging |
| `backend/openenv.yaml` | OpenEnv competition manifest |
| `frontend/src/hooks/useEnvironment.js` | Central React state (all API calls live here) |
| `frontend/src/api/envClient.js` | Raw Axios wrappers for each backend endpoint |
| `frontend/src/App.jsx` | Root layout with desktop (3-col) and mobile (tab) views |
| `frontend/src/index.css` | Design system (glass, buttons, badges, animations) |
| `frontend/tailwind.config.js` | Custom colors, fonts, keyframes |
| `docker-compose.yml` | Production orchestration |

---

*ClaimLens is built for the OpenEnv competition. The core inspiration is the real-world scientific fact-checking workflow — a task that demands careful sequential reasoning, source quality evaluation, and calibrated uncertainty.*
