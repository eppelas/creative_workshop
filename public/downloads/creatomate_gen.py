"""
Creatomate Video Assembler
===========================
Assemble videos from clips + text overlays via Creatomate API.

Usage:  python3 creatomate_gen.py

Reads variations.json (or uses built-in demo data) to render
multiple video variations from the same source clips with different
texts and timings.

Get API key: https://creatomate.com (free tier: 5 renders/month with watermark)
"""

import requests, time, os, sys, json

CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".creatomate_config.json")
API_URL = "https://api.creatomate.com/v2/renders"

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
    k = input("Creatomate API key: ").strip()
    if not k: print("Required."); sys.exit(1)
    c["api_key"] = k; save_cfg(c); print("  Saved.\n"); return k

def H(key): return {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

# ── RenderScript builder ────────────────────────────

def build_renderscript(clip1_url, clip2_url, variations):
    """
    Build a list of RenderScript payloads for each variation.

    Each variation dict:
      - text1: str       -- text overlay after clip1
      - text2: str       -- text overlay after clip2
      - clip1_dur: float -- duration of clip1 segment (seconds)
      - clip2_dur: float -- duration of clip2 segment (seconds)
      - text1_dur: float -- duration of text1 card (default 2)
      - text2_dur: float -- duration of text2 card (default 2)
      - name: str        -- output name (optional)
    """
    renders = []
    for i, v in enumerate(variations):
        c1d = v.get("clip1_dur", 3)
        c2d = v.get("clip2_dur", 3)
        t1d = v.get("text1_dur", 2)
        t2d = v.get("text2_dur", 2)
        t1 = v.get("text1", "")
        t2 = v.get("text2", "")

        elements = []

        # Clip 1
        elements.append({
            "type": "video",
            "track": 1,
            "time": 0,
            "duration": c1d,
            "source": clip1_url,
            "trim_start": 0,
            "trim_duration": c1d,
        })

        # Text card 1
        if t1:
            elements.append({
                "type": "composition",
                "track": 1,
                "duration": t1d,
                "fill_color": "rgba(0,0,0,1)",
                "animations": [
                    {"time": 0, "duration": 0.5, "transition": True, "type": "fade"}
                ],
                "elements": [{
                    "type": "text",
                    "text": t1,
                    "width": "80%",
                    "y": "50%",
                    "fill_color": "#ffffff",
                    "font_family": "Inter",
                    "font_weight": "700",
                    "font_size": "5 vmin",
                    "x_alignment": "50%",
                    "y_alignment": "50%",
                    "animations": [
                        {"time": 0, "duration": 0.6, "easing": "quadratic-out", "type": "text-slide", "scope": "split-clip", "split": "line"}
                    ]
                }]
            })

        # Clip 2
        elements.append({
            "type": "video",
            "track": 1,
            "duration": c2d,
            "source": clip2_url,
            "trim_start": 0,
            "trim_duration": c2d,
            "animations": [
                {"time": 0, "duration": 0.5, "transition": True, "type": "fade"}
            ]
        })

        # Text card 2
        if t2:
            elements.append({
                "type": "composition",
                "track": 1,
                "duration": t2d,
                "fill_color": "rgba(0,0,0,1)",
                "animations": [
                    {"time": 0, "duration": 0.5, "transition": True, "type": "fade"}
                ],
                "elements": [{
                    "type": "text",
                    "text": t2,
                    "width": "80%",
                    "y": "50%",
                    "fill_color": "#ffffff",
                    "font_family": "Inter",
                    "font_weight": "700",
                    "font_size": "5 vmin",
                    "x_alignment": "50%",
                    "y_alignment": "50%",
                    "animations": [
                        {"time": 0, "duration": 0.6, "easing": "quadratic-out", "type": "text-slide", "scope": "split-clip", "split": "line"}
                    ]
                }]
            })

        script = {
            "output_format": "mp4",
            "width": 1280,
            "height": 720,
            "elements": elements,
            "metadata": v.get("name", f"variation_{i+1}")
        }
        renders.append(script)

    return renders

# ── API ─────────────────────────────────────────────

def submit_render(script, headers):
    r = requests.post(API_URL, json=script, headers=headers)
    if r.status_code in (200, 201):
        data = r.json()
        if isinstance(data, list): data = data[0]
        rid = data.get("id")
        print(f"  Render {rid} submitted")
        return rid, data.get("url")
    print(f"  Error: {r.status_code} - {r.text[:300]}")
    return None, None

def poll_render(render_id, headers, poll=3, timeout=300):
    t = 0
    while t < timeout:
        r = requests.get(f"{API_URL}/{render_id}", headers=headers)
        if r.status_code == 200:
            d = r.json()
            s = d.get("status")
            mn, sc = divmod(t, 60)
            print(f"\r  {mn}m{sc:02d}s ({s})", end="", flush=True)
            if s == "succeeded":
                print()
                return d.get("url")
            if s == "failed":
                print(f"\n  Failed: {d.get('error')}")
                return None
        time.sleep(poll); t += poll
    print("\n  Timeout"); return None

def download(url, filepath):
    r = requests.get(url)
    if r.status_code == 200:
        with open(filepath, "wb") as f: f.write(r.content)
        print(f"  Saved: {filepath}"); return True
    print(f"  DL error {r.status_code}"); return False

# ── Main ────────────────────────────────────────────

DEMO_VARIATIONS = [
    {"text1": "THE NIGHT\nHAS A THOUSAND EYES", "text2": "SYSTEM STATUS: ACTIVE", "clip1_dur": 3, "clip2_dur": 3, "name": "v1_standard"},
    {"text1": "EVERY SHADOW\nIS WATCHING", "text2": "CYCLE 002 INITIATED", "clip1_dur": 3, "clip2_dur": 4, "name": "v2_longer"},
    {"text1": "DARKNESS\nSPEAKS IN CODE", "text2": "SIGNAL DETECTED", "clip1_dur": 3, "clip2_dur": 3, "name": "v3_code"},
    {"text1": "MONOLITHS\nAWAKEN", "text2": "DORMANT NO MORE", "clip1_dur": 3, "clip2_dur": 4, "name": "v4_awaken"},
    {"text1": "THE VOID\nRETURNS", "text2": "FINAL TRANSMISSION", "clip1_dur": 3, "clip2_dur": 3, "text2_dur": 3, "name": "v5_final"},
]

def main():
    print("=" * 50)
    print("  CREATOMATE VIDEO ASSEMBLER")
    print("=" * 50 + "\n")

    key = get_key()
    h = H(key)

    default_dir = os.path.join(os.path.expanduser("~"), "Desktop", "creatomate_output")
    d = input(f"Output dir [{default_dir}]: ").strip()
    out = d if d else default_dir
    os.makedirs(out, exist_ok=True)

    # Video clips
    print("\nSource video clips (URLs or local paths):")
    clip1 = input("  Clip 1 URL: ").strip()
    clip2 = input("  Clip 2 URL (Enter = same as clip 1): ").strip() or clip1
    if not clip1:
        print("  Need at least one clip URL."); return

    # Variations: from file or demo
    var_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "variations.json")
    if os.path.exists(var_file):
        with open(var_file) as f: variations = json.load(f)
        print(f"\n  Loaded {len(variations)} variations from variations.json")
    else:
        print(f"\n  No variations.json found, using {len(DEMO_VARIATIONS)} demo variations")
        variations = DEMO_VARIATIONS
        with open(var_file, "w") as f: json.dump(DEMO_VARIATIONS, f, indent=2, ensure_ascii=False)
        print(f"  Saved demo to {var_file} (edit it for custom variations)")

    print(f"\nVariations:")
    for i, v in enumerate(variations):
        print(f"  [{i+1}] {v.get('name','?')}: \"{v.get('text1','')}\" | clip2: {v.get('clip2_dur',3)}s")

    if input(f"\nRender {len(variations)} videos? [Y/n]: ").strip().lower() == "n": return

    # Build and submit
    scripts = build_renderscript(clip1, clip2, variations)

    print(f"\n{'='*50}\n")
    files = []
    for i, script in enumerate(scripts):
        name = variations[i].get("name", f"v{i+1}")
        print(f"[{i+1}/{len(scripts)}] {name}")
        rid, url = submit_render(script, h)
        if rid:
            if url:
                fp = os.path.join(out, f"{name}.mp4")
                if download(url, fp): files.append(fp)
            else:
                result_url = poll_render(rid, h)
                if result_url:
                    fp = os.path.join(out, f"{name}.mp4")
                    if download(result_url, fp): files.append(fp)
        print()

    print(f"{'='*50}\nDone! {len(files)} videos in {out}")

if __name__ == "__main__":
    main()
