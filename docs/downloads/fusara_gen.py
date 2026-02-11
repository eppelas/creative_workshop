"""
Fusara Image Generator
======================
Generate images via Fusara API with style/character references and LoRA.

Usage:  python3 fusara_gen.py

First run: enter your Fusara API key (saved locally).
Choose model, references, paste prompts, generate.
Each paragraph (separated by empty lines) = one prompt.
"""

import requests, time, os, sys, json, urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".fusara_config.json")
BASE = "https://api.fusara.ai"
GEN_URL = f"{BASE}/api/integration/imaging/generate"
TASKS_URL = f"{BASE}/api/integration/imaging/tasks"
MODELS_URL = f"{BASE}/api/integration/models"

MODELS = {
    "flux":   {"__type": 5,  "name": "Flux1 Dev",      "defaults": {"Width": 1024, "Height": 1024, "NumberOfInferenceSteps": 40, "GuidanceScale": 3.5},
               "supports": {"style_ref", "char_ref", "image_ref", "lora"}},
    "sdxl":   {"__type": 4,  "name": "SDXL",           "defaults": {"Width": 1024, "Height": 1024, "NumberOfInferenceSteps": 25, "GuidanceScale": 6.5},
               "supports": {"style_ref", "char_ref", "image_ref", "lora"}},
    "qwen":   {"__type": 21, "name": "Qwen Image",     "defaults": {"Width": 1024, "Height": 1024, "NumberOfInferenceSteps": 50, "GuidanceScale": 4.0},
               "supports": {"style_ref", "char_ref", "image_ref"}},
    "imagen": {"__type": 15, "name": "Google Imagen 4", "defaults": {"AspectRatio": "1:1"},
               "supports": set()},
    "gpt":    {"__type": 16, "name": "GPT Image",      "defaults": {"Size": "1024x1024", "Quality": "medium"},
               "supports": {"image_ref"}},
    "gemini": {"__type": 18, "name": "Google Gemini",   "defaults": {},
               "supports": {"image_ref"}},
}

PRESETS = {
    "image_ref": {"__type": 1, "label": "Image Reference"},
    "style_ref": {"__type": 2, "label": "Style Reference"},
    "char_ref":  {"__type": 3, "label": "Character Reference"},
}

ASPECTS = {"1:1": (1024, 1024), "16:9": (1280, 720), "9:16": (720, 1280), "4:3": (1152, 864), "3:4": (864, 1152)}

# ── Config ──────────────────────────────────────────

def load_cfg():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE) as f: return json.load(f)
    return {}

def save_cfg(c):
    with open(CONFIG_FILE, "w") as f: json.dump(c, f, indent=2)

def get_key():
    c = load_cfg()
    if c.get("api_key"): return c["api_key"]
    k = input("Fusara API key: ").strip()
    if not k: print("Required."); sys.exit(1)
    c["api_key"] = k; save_cfg(c); print("  Saved.\n"); return k

def H(key): return {"X-API-Key": key, "Content-Type": "application/json"}

# ── API ─────────────────────────────────────────────

def upload_lora(name, url, trigger, h):
    r = requests.post(MODELS_URL, json={"Name": name, "ModelUrl": url, "TriggerString": trigger}, headers=h, verify=False)
    if r.status_code == 200:
        mid = r.json().get("data", {}).get("modelId") or r.json().get("modelId")
        print(f"  LoRA uploaded, modelId: {mid}"); return mid
    print(f"  LoRA error: {r.status_code} - {r.text[:200]}"); return None

def submit(prompt, mk, num, presets, lora_id, h):
    m = MODELS[mk]
    body = {"__type": m["__type"], "Prompt": prompt, "NumberOfImages": num}
    body.update(m["defaults"])
    if presets: body["TaskPresets"] = presets
    if lora_id: body["TaskModels"] = [{"ModelId": lora_id}]
    r = requests.post(GEN_URL, json=body, headers=h, verify=False)
    if r.status_code == 200:
        tid = r.json().get("data", {}).get("taskId")
        print(f"  Task {tid} ({m['name']})"); return tid
    print(f"  Error: {r.status_code} - {r.text[:200]}"); return None

def wait(tid, h, poll=5, timeout=300):
    t = 0
    while t < timeout:
        r = requests.get(f"{TASKS_URL}/{tid}/status", headers=h, verify=False)
        if r.status_code == 200:
            s = r.json().get("data")
            mn, sc = divmod(t, 60)
            print(f"\r  {mn}m{sc:02d}s ...", end="", flush=True)
            if s == 100: print(); return True
            if s and s >= 400: print(f"\n  Failed ({s})"); return False
        else: print(f"\n  Error {r.status_code}"); return False
        time.sleep(poll); t += poll
    print("\n  Timeout"); return False

def dl(tid, out, h, pfx):
    r = requests.get(f"{TASKS_URL}/{tid}", headers=h, verify=False)
    if r.status_code != 200: print("  Download error"); return []
    imgs = r.json().get("data", {}).get("images", [])
    saved = []
    for i, img in enumerate(imgs):
        url = img.get("url")
        if not url: continue
        fp = os.path.join(out, f"{pfx}_{tid}_{i+1}.png")
        with open(fp, "wb") as f: f.write(requests.get(url, verify=False).content)
        saved.append(fp); print(f"  Saved: {fp}")
    return saved

# ── Input ───────────────────────────────────────────

def ask(text, opts, default=None):
    print(text)
    for k, v in opts.items(): print(f"  {k}: {v}{'  *' if k == default else ''}")
    c = input("> ").strip().lower()
    return c if c in opts else default

def read_prompts():
    print("Paste prompts (each paragraph = one prompt).")
    print("Finish with two empty lines:\n")
    lines, emp = [], 0
    while True:
        try: ln = input()
        except EOFError: break
        if not ln.strip():
            emp += 1; lines.append("")
            if emp >= 2: break
        else: emp = 0; lines.append(ln)
    parts, cur = [], []
    for ln in lines:
        if ln.strip(): cur.append(ln.strip())
        elif cur: parts.append(" ".join(cur)); cur = []
    if cur: parts.append(" ".join(cur))
    return parts

def ask_refs(mk):
    sup = MODELS[mk]["supports"]
    avail = {k: v for k, v in PRESETS.items() if k in sup}
    if not avail:
        print(f"\n  {MODELS[mk]['name']}: no reference support.\n"); return []
    print(f"\n  {MODELS[mk]['name']} supports: {', '.join(v['label'] for v in avail.values())}")
    print("  Add references? (Enter to skip)\n")
    presets = []
    for key, info in avail.items():
        url = input(f"  {info['label']} image URL (Enter to skip): ").strip()
        if not url: continue
        w = input(f"  {info['label']} weight 0-100 [80]: ").strip()
        wt = int(w) if w.isdigit() and 0 <= int(w) <= 100 else 80
        presets.append({"__type": info["__type"], "Weight": wt, "ExternalUrl": url})
        print(f"    Added (weight {wt})")
    return presets

def ask_lora(mk, h):
    if "lora" not in MODELS[mk]["supports"]: return None
    print(f"\n  {MODELS[mk]['name']} supports LoRA.")
    url = input("  LoRA URL (CivitAI link, Enter to skip): ").strip()
    if not url: return None
    name = input("  LoRA name [my-lora]: ").strip() or "my-lora"
    trigger = input("  Trigger word (Enter if none): ").strip() or ""
    return upload_lora(name, url, trigger, h)

# ── Main ────────────────────────────────────────────

def main():
    print("=" * 50)
    print("  FUSARA IMAGE GENERATOR")
    print("=" * 50 + "\n")

    key = get_key(); h = H(key)

    default_dir = os.path.join(os.path.expanduser("~"), "Desktop", "fusara_output")
    d = input(f"Output dir [{default_dir}]: ").strip()
    out = d if d else default_dir
    os.makedirs(out, exist_ok=True)

    print("\nModels:")
    for k, v in MODELS.items():
        f = []
        if "style_ref" in v["supports"]: f.append("style")
        if "char_ref" in v["supports"]: f.append("char")
        if "lora" in v["supports"]: f.append("LoRA")
        tag = f" [{', '.join(f)}]" if f else ""
        print(f"  {k}: {v['name']}{tag}")
    mk = input("\nModel [flux]: ").strip().lower()
    if mk not in MODELS: mk = "flux"
    print(f"  -> {MODELS[mk]['name']}\n")

    if "Width" in MODELS[mk]["defaults"]:
        ar = ask("Aspect ratio:", {k: f"{v[0]}x{v[1]}" for k, v in ASPECTS.items()}, "1:1")
        w, ht = ASPECTS[ar]
        MODELS[mk]["defaults"]["Width"] = w; MODELS[mk]["defaults"]["Height"] = ht

    n = input("Images per prompt [1]: ").strip()
    num = int(n) if n.isdigit() and 1 <= int(n) <= 4 else 1

    presets = ask_refs(mk)
    lora_id = ask_lora(mk, h)
    prompts = read_prompts()
    if not prompts: print("No prompts."); return

    print(f"\n{len(prompts)} prompts:")
    for i, p in enumerate(prompts): print(f"  [{i+1}] {p[:80]}{'...' if len(p)>80 else ''}")
    if presets: print(f"References: {len(presets)}")
    if lora_id: print(f"LoRA: {lora_id}")
    if input("\nGenerate? [Y/n]: ").strip().lower() == "n": return

    print(f"\n{'='*50}\n")
    files = []
    for i, p in enumerate(prompts):
        print(f"[{i+1}/{len(prompts)}] {p[:70]}...")
        tid = submit(p, mk, num, presets, lora_id, h)
        if tid and wait(tid, h): files += dl(tid, out, h, f"img{i+1}")
        print()
    print(f"{'='*50}\nDone! {len(files)} images in {out}")

if __name__ == "__main__":
    main()
