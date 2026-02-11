"""
Replicate Image Generator
==========================
Generate images via Replicate API (Imagen 4, Flux, SDXL + LoRA).

Usage:  python3 replicate_gen.py

First run: enter your Replicate API token (saved locally).
Get token at: https://replicate.com/account/api-tokens
Each paragraph (separated by empty lines) = one prompt.
"""

import requests, time, os, sys, json

CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".replicate_config.json")
BASE = "https://api.replicate.com/v1"

MODELS = {
    "imagen4":    {"id": "google/imagen-4",                "name": "Google Imagen 4",  "supports": set(),       "input_defaults": {"aspect_ratio": "16:9"}},
    "flux-dev":   {"id": "black-forest-labs/flux-dev",     "name": "Flux Dev",         "supports": {"lora"},    "input_defaults": {}},
    "flux-schnell": {"id": "black-forest-labs/flux-schnell", "name": "Flux Schnell (fast)", "supports": {"lora"}, "input_defaults": {}},
    "sdxl":       {"id": "stability-ai/sdxl",              "name": "SDXL",             "supports": {"lora"},    "input_defaults": {"width": 1024, "height": 1024}},
}

ASPECTS = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]

# ── Config ──────────────────────────────────────────

def load_cfg():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE) as f: return json.load(f)
    return {}

def save_cfg(c):
    with open(CONFIG_FILE, "w") as f: json.dump(c, f, indent=2)

def get_token():
    c = load_cfg()
    if c.get("token"): return c["token"]
    t = input("Replicate API token: ").strip()
    if not t: print("Required."); sys.exit(1)
    c["token"] = t; save_cfg(c); print("  Saved.\n"); return t

def H(token): return {"Authorization": f"Bearer {token}", "Content-Type": "application/json", "Prefer": "wait"}

# ── API ─────────────────────────────────────────────

def generate(prompt, model_key, aspect, lora_url, lora_scale, token):
    m = MODELS[model_key]
    h = H(token)
    inp = {"prompt": prompt}
    inp.update(m["input_defaults"])

    if aspect and "aspect_ratio" not in inp:
        inp["aspect_ratio"] = aspect
    elif aspect:
        inp["aspect_ratio"] = aspect

    if lora_url and "lora" in m["supports"]:
        inp["hf_lora"] = lora_url
        if lora_scale: inp["lora_scale"] = lora_scale

    url = f"{BASE}/models/{m['id']}/predictions"
    r = requests.post(url, json={"input": inp}, headers=h)

    if r.status_code == 200 or r.status_code == 201:
        data = r.json()
        status = data.get("status")
        if status == "succeeded":
            output = data.get("output")
            if isinstance(output, str):
                return output
            elif isinstance(output, list) and output:
                return output[0]
        elif status in ("starting", "processing"):
            return poll_prediction(data.get("id"), token)
        else:
            print(f"  Status: {status}, error: {data.get('error')}")
            return None
    else:
        print(f"  Error: {r.status_code} - {r.text[:300]}")
        return None

def poll_prediction(pred_id, token, poll=3, timeout=300):
    h = {"Authorization": f"Bearer {token}"}
    t = 0
    while t < timeout:
        r = requests.get(f"{BASE}/predictions/{pred_id}", headers=h)
        if r.status_code == 200:
            data = r.json()
            s = data.get("status")
            mn, sc = divmod(t, 60)
            print(f"\r  {mn}m{sc:02d}s ({s})", end="", flush=True)
            if s == "succeeded":
                print()
                out = data.get("output")
                if isinstance(out, str): return out
                if isinstance(out, list) and out: return out[0]
                return None
            if s == "failed":
                print(f"\n  Failed: {data.get('error')}")
                return None
        time.sleep(poll); t += poll
    print("\n  Timeout"); return None

def download(url, filepath):
    r = requests.get(url)
    if r.status_code == 200:
        with open(filepath, "wb") as f: f.write(r.content)
        print(f"  Saved: {filepath}"); return True
    print(f"  Download error: {r.status_code}"); return False

# ── Input ───────────────────────────────────────────

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

# ── Main ────────────────────────────────────────────

def main():
    print("=" * 50)
    print("  REPLICATE IMAGE GENERATOR")
    print("=" * 50 + "\n")

    token = get_token()

    default_dir = os.path.join(os.path.expanduser("~"), "Desktop", "replicate_output")
    d = input(f"Output dir [{default_dir}]: ").strip()
    out = d if d else default_dir
    os.makedirs(out, exist_ok=True)

    print("\nModels:")
    for k, v in MODELS.items():
        tag = " [LoRA]" if "lora" in v["supports"] else ""
        print(f"  {k}: {v['name']}{tag}")
    mk = input("\nModel [imagen4]: ").strip().lower()
    if mk not in MODELS: mk = "imagen4"
    print(f"  -> {MODELS[mk]['name']}\n")

    print("Aspect ratio options:", ", ".join(ASPECTS))
    ar = input("Aspect ratio [16:9]: ").strip()
    if ar not in ASPECTS: ar = "16:9"
    print(f"  -> {ar}\n")

    lora_url, lora_scale = None, None
    if "lora" in MODELS[mk]["supports"]:
        print(f"  {MODELS[mk]['name']} supports LoRA.")
        lora_url = input("  HuggingFace LoRA URL (Enter to skip): ").strip() or None
        if lora_url:
            s = input("  LoRA scale 0.0-1.0 [0.8]: ").strip()
            lora_scale = float(s) if s else 0.8
            print(f"    LoRA: {lora_url} (scale {lora_scale})\n")

    prompts = read_prompts()
    if not prompts: print("No prompts."); return

    print(f"\n{len(prompts)} prompts:")
    for i, p in enumerate(prompts): print(f"  [{i+1}] {p[:80]}{'...' if len(p)>80 else ''}")
    if lora_url: print(f"LoRA: {lora_url}")
    if input("\nGenerate? [Y/n]: ").strip().lower() == "n": return

    print(f"\n{'='*50}\n")
    files = []
    for i, p in enumerate(prompts):
        print(f"[{i+1}/{len(prompts)}] {p[:70]}...")
        img_url = generate(p, mk, ar, lora_url, lora_scale, token)
        if img_url:
            ext = "jpg" if ".jpg" in img_url else "png"
            fp = os.path.join(out, f"img{i+1}.{ext}")
            if download(img_url, fp): files.append(fp)
        print()

    print(f"{'='*50}\nDone! {len(files)} images in {out}")

if __name__ == "__main__":
    main()
