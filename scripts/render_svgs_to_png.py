import os
import subprocess
import glob

DIAGRAMS_DIR = os.path.abspath("AgriNexus-AI-Report/AgriNexus_AI_Architecture_Diagrams")
svg_files = sorted(glob.glob(os.path.join(DIAGRAMS_DIR, "*.svg")))

chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

for svg_path in svg_files:
    png_path = svg_path.replace(".svg", ".png")
    # Read width and height from SVG or use defaults
    cmd = [
        chrome_bin,
        "--headless=new",
        "--window-size=1200,800",
        f"--screenshot={png_path}",
        f"file://{svg_path}"
    ]
    print(f"Rendering {os.path.basename(svg_path)} -> {os.path.basename(png_path)}...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if os.path.exists(png_path):
        size = os.path.getsize(png_path)
        print(f"  OK: {size} bytes")
    else:
        print(f"  FAILED: {res.stderr.decode()[:200]}")

print("All diagrams rendered to PNG.")
