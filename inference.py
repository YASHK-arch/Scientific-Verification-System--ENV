"""
ClaimLens — Baseline Inference Agent
Uses the OpenAI Python client to run through scenarios with strict stdout logging.
"""

import json
import os
import sys

from openai import OpenAI

# ──────────────────── Config ────────────────────

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
MODEL_NAME = os.getenv("MODEL_NAME", "meta-llama/Llama-3-70B-Instruct")
HF_TOKEN = os.getenv("HF_TOKEN", "")

# OpenAI client pointing to HF or local inference
client = OpenAI(
    base_url=os.getenv("OPENAI_BASE_URL", "https://api-inference.huggingface.co/v1"),
    api_key=HF_TOKEN or "dummy",
)

# ──────────────────── Environment Client ────────────────────

import httpx

ENV_URL = API_BASE_URL


def env_reset(task_id: str) -> dict:
    resp = httpx.post(f"{ENV_URL}/api/reset", json={"task_id": task_id})
    resp.raise_for_status()
    return resp.json()


def env_step(action: dict) -> dict:
    resp = httpx.post(f"{ENV_URL}/api/step", json={"action": action})
    resp.raise_for_status()
    return resp.json()


def env_grade() -> dict:
    resp = httpx.get(f"{ENV_URL}/api/grade")
    resp.raise_for_status()
    return resp.json()


# ──────────────────── LLM-based Agent ────────────────────

SYSTEM_PROMPT = """You are a scientific claim verification agent. You are given a scientific claim and a list of evidence items. Your job is to:

1. Evaluate each piece of evidence by requesting to read it
2. Take notes on your analysis
3. Determine if the claim is "supported", "unsupported", or "inconclusive"
4. Provide a calibrated confidence score (0.0 to 1.0)

For each step, respond with a JSON object describing your action:
- {"action_type": "evaluate_evidence", "target_id": "<evidence_id>"}
- {"action_type": "update_notes", "content": "<your reasoning>"}
- {"action_type": "set_verdict", "content": "<supported|unsupported|inconclusive>"}
- {"action_type": "finalize", "confidence": <0.0-1.0>, "content": "<justification>"}

Think step by step. Evaluate ALL evidence before setting a verdict. Pay attention to study quality, statistical significance, sample sizes, and potential biases."""


def run_agent(task_id: str):
    """Run the LLM agent on a single scenario."""
    print(f"[START] task={task_id} env=SCV model={MODEL_NAME}", flush=True)
    rewards = []

    # Reset environment
    obs = env_reset(task_id)
    claim = obs["claim"]
    evidence_list = obs["available_evidence"]

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                f"CLAIM: {claim}\n\n"
                f"AVAILABLE EVIDENCE:\n"
                + "\n".join(
                    f"- [{ev['id']}] ({ev['type']}): {ev['title']}"
                    for ev in evidence_list
                )
                + "\n\nBegin your investigation. Respond with your first action as JSON."
            ),
        },
    ]

    max_iterations = 12
    for i in range(max_iterations):
        if obs.get("done", False):
            break

        # Call LLM
        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                temperature=0.1,
                max_tokens=500,
            )
            assistant_msg = response.choices[0].message.content
        except Exception as e:
            print(f"[STEP] step={i+1} action=None reward=0.0 done=False error={e}", flush=True)
            break

        # Parse action from LLM response
        try:
            # Extract JSON from response
            action = _extract_json(assistant_msg)
        except Exception:
            print(f"[STEP] step={i+1} action=None reward=0.0 done=False error=parse_failed", flush=True)
            messages.append({"role": "assistant", "content": assistant_msg})
            messages.append({
                "role": "user",
                "content": "Please respond with a valid JSON action object.",
            })
            continue

        # Execute action
        action_type = action.get("action_type", "")
        target = action.get("target_id", "")
        content = action.get("content", "")
        confidence = action.get("confidence", "")

        try:
            obs = env_step(action)
            reward = obs.get("reward", 0.0)
            done = obs.get("done", False)
            rewards.append(reward)
            print(f"[STEP] step={i+1} action={json.dumps(action)} reward={reward} done={done} error=None", flush=True)
        except Exception as e:
            print(f"[STEP] step={i+1} action={json.dumps(action)} reward=0.0 done=False error={e}", flush=True)
            break

        # Feed result back to LLM
        messages.append({"role": "assistant", "content": assistant_msg})

        if action_type == "evaluate_evidence" and target in obs.get("evaluated_evidence", {}):
            ev_content = obs["evaluated_evidence"][target]
            messages.append({
                "role": "user",
                "content": (
                    f"Evidence '{target}' content:\n{ev_content}\n\n"
                    f"Reward: {obs['reward']:.2f} | Cumulative: {obs['cumulative_reward']:.2f}\n"
                    f"Continue your investigation. Respond with your next action as JSON."
                ),
            })
        else:
            messages.append({
                "role": "user",
                "content": (
                    f"Action result — Reward: {obs['reward']:.2f} | "
                    f"Cumulative: {obs['cumulative_reward']:.2f} | "
                    f"Status: {obs['current_status']}\n"
                    f"Continue. Respond with your next action as JSON."
                ),
            })

    # Grade
    try:
        grade = env_grade()
        verdict = grade.get("agent_verdict", "unknown")
        score = float(grade.get("total_score", 0.0))
        success = score >= 0.8
        print(f"[END] success={success} steps={i+1} score={score:.3f} rewards={rewards}", flush=True)
    except Exception as e:
        print(f"[END] success=False steps={i+1} score=0.0 rewards={rewards} error={e}", flush=True)


def _extract_json(text: str) -> dict:
    """Extract JSON object from LLM response text."""
    # Try direct parse
    text = text.strip()
    if text.startswith("{"):
        return json.loads(text)

    # Try to find JSON in markdown code block
    import re
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        return json.loads(match.group(1))

    # Try to find any JSON object
    match = re.search(r"\{[^{}]*\}", text)
    if match:
        return json.loads(match.group())

    raise ValueError("No JSON found in response")


# ──────────────────── Main ────────────────────

if __name__ == "__main__":
    tasks = sys.argv[1:] if len(sys.argv) > 1 else ["easy_1"]
    for task_id in tasks:
        run_agent(task_id)
        print()
