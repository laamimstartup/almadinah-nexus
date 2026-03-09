"""
Deploy Firestore security rules via the Firebase Management REST API.
Uses a service account token obtained from firebase-admin.
"""
import os, json, sys, urllib.request, urllib.error
import google.auth
import google.auth.transport.requests
from google.oauth2 import service_account

# ── load env ──────────────────────────────────────────────────────────────
from pathlib import Path
env_path = Path(__file__).parent.parent / ".env.local"
env = {}
for line in env_path.read_text().splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"')

PROJECT_ID   = env["FIREBASE_PROJECT_ID"]
CLIENT_EMAIL = env["FIREBASE_CLIENT_EMAIL"]
PRIVATE_KEY  = env["FIREBASE_PRIVATE_KEY"].replace("\\n", "\n")

# ── build credentials ──────────────────────────────────────────────────────
creds = service_account.Credentials.from_service_account_info(
    {
        "type": "service_account",
        "project_id": PROJECT_ID,
        "private_key": PRIVATE_KEY,
        "client_email": CLIENT_EMAIL,
        "token_uri": "https://oauth2.googleapis.com/token",
    },
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)
creds.refresh(google.auth.transport.requests.Request())
token = creds.token

def api(method, url, body=None):
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
    )
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"HTTP {e.code}: {err_body}")
        return None

# ── read rules files ──────────────────────────────────────────────────────
rules_dir = Path(__file__).parent.parent
firestore_rules = (rules_dir / "firestore.rules").read_text()
storage_rules   = (rules_dir / "storage.rules").read_text()

BASE = "https://firebaserules.googleapis.com/v1"

# ── deploy Firestore rules ────────────────────────────────────────────────
print("Deploying Firestore rules...")
release_name = f"projects/{PROJECT_ID}/releases/cloud.firestore"
ruleset_body = {
    "source": {
        "files": [{"name": "firestore.rules", "content": firestore_rules}]
    }
}
ruleset = api("POST", f"{BASE}/projects/{PROJECT_ID}/rulesets", ruleset_body)
ruleset_name = ruleset["name"]
print(f"  Ruleset created: {ruleset_name}")

# PATCH with update_mask updates an existing release's ruleset pointer
patch_body = {"release": {"name": release_name, "rulesetName": ruleset_name}}
resp = api("PATCH", f"{BASE}/{release_name}?updateMask=rulesetName", patch_body)
if resp:
    print("  Firestore rules release updated ✓")
else:
    api("POST", f"{BASE}/projects/{PROJECT_ID}/releases",
        {"name": release_name, "rulesetName": ruleset_name})
    print("  Firestore rules release created ✓")

# ── deploy Storage rules ─────────────────────────────────────────────────
print("Deploying Storage rules...")
storage_ruleset_body = {
    "source": {
        "files": [{"name": "storage.rules", "content": storage_rules}]
    }
}
storage_ruleset = api("POST", f"{BASE}/projects/{PROJECT_ID}/rulesets", storage_ruleset_body)
storage_ruleset_name = storage_ruleset["name"]
print(f"  Ruleset created: {storage_ruleset_name}")

bucket = f"{PROJECT_ID}.appspot.com"
storage_release_name = f"projects/{PROJECT_ID}/releases/firebase.storage/{bucket}"
patch_storage = {"release": {"name": storage_release_name, "rulesetName": storage_ruleset_name}}
resp2 = api("PATCH", f"{BASE}/{storage_release_name}?updateMask=rulesetName", patch_storage)
if resp2:
    print("  Storage rules release updated ✓")
else:
    api("POST", f"{BASE}/projects/{PROJECT_ID}/releases",
        {"name": storage_release_name, "rulesetName": storage_ruleset_name})
    print("  Storage rules release created ✓")

print("\n✅ All rules deployed successfully!")
