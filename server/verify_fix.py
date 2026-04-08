import sys, os
import json

# Add current dir to path to import models and server.app
sys.path.append(os.getcwd())

from server.app import env, _compute_auto_action
from models import VerdictStatus

def run_simulation(task_id):
    print(f"\n--- Simulating {task_id} ---")
    obs = env.reset(task_id)
    state = env.state
    
    for i in range(15):
        if obs.done:
            print(f"Episode finished at step {i}")
            break
        
        action = _compute_auto_action(obs, state)
        print(f"Step {i}: Action={action.action_type.value}, Status={obs.current_status.value}")
        obs = env.step(action)
        state = env.state

    # Final result
    print(f"Final Status: {obs.current_status.value}")
    print(f"State Final Verdict: {state.final_verdict}")
    
    if state.final_verdict is None:
        print("FAIL: final_verdict is None")
        return False
    else:
        print(f"SUCCESS: final_verdict is {state.final_verdict}")
        return True

if __name__ == "__main__":
    s1 = run_simulation('easy_2')
    s2 = run_simulation('hard_1')
    
    if s1 and s2:
        print("\nALL TESTS PASSED")
        sys.exit(0)
    else:
        print("\nTESTS FAILED")
        sys.exit(1)
