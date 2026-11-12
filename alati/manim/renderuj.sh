#!/usr/bin/env bash
# Pravi animirane WebP slike iz alati/manim/scene.py u kvizovi/matematika/animacije/.
#   alati/manim/renderuj.sh              – sve scene
#   alati/manim/renderuj.sh Pitagora …   – samo navedene
# Potrebno: manim (pip install manim, u virtuelnom okruženju; MANIM=put/do/manim) i ffmpeg sa libwebp.
set -euo pipefail
cd "$(dirname "$0")/../.."
MANIM="${MANIM:-manim}"
IZLAZ=kvizovi/matematika/animacije
RAD="${TMPDIR:-/tmp}/skviz-manim"
mkdir -p "$IZLAZ" "$RAD"
scene=("$@")
if [ ${#scene[@]} -eq 0 ]; then
  mapfile -t scene < <(grep -oP '^class \K\w+(?=\(\w*Scene\))' alati/manim/scene.py)
fi
for s in "${scene[@]}"; do
  ime=$(echo "$s" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr 'A-Z' 'a-z')
  "$MANIM" render -q l --resolution 640,400 --frame_rate 20 --format mp4 --disable_caching --progress_bar none \
    --media_dir "$RAD" -o "$ime" alati/manim/scene.py "$s" >/dev/null
  mp4=$(find "$RAD/videos" -name "$ime.mp4" | head -1)
  ffmpeg -loglevel error -y -i "$mp4" -vf "fps=15,scale=480:-1:flags=lanczos" -c:v libwebp_anim \
    -lossless 0 -quality 70 -compression_level 6 -loop 0 -an "$IZLAZ/$ime.webp"
  echo "✓ $IZLAZ/$ime.webp ($(du -k "$IZLAZ/$ime.webp" | cut -f1) KB)"
done
