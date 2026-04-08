import json
import urllib.request
from urllib.error import HTTPError

req = urllib.request.Request("http://localhost:8000/api/reset", data=json.dumps({"task_id":"easy_1"}).encode(), headers={"Content-Type": "application/json"})
resp = urllib.request.urlopen(req)
print("RESET: ", resp.status)

for i in range(5):
    req = urllib.request.Request("http://localhost:8000/api/auto-step", method="POST")
    try:
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read())
        act = res.get("action", {})
        print(f"STEP {i} action: {act.get('action_type')} content: {act.get('content')}")
    except HTTPError as e:
        print(f"STEP {i} failed: {e.code} {e.read().decode()}")
    except Exception as e:
        print(f"STEP {i} failed: {e}")

try:
    req = urllib.request.Request("http://localhost:8000/api/grade")
    resp = urllib.request.urlopen(req)
    print("GRADE: ", json.loads(resp.read()))
except HTTPError as e:
    print(f"GRADE failed: {e.code} {e.read().decode()}")
