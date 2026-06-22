#!/bin/sh
set -eu

SRC=/usr/share/nginx/html/ipinfo.json   # placeholder baked into the image (read-only)
OUT=/tmp/ipinfo.json                     # writable at runtime; what nginx serves

# Best-effort refresh of the server's own IP info into a writable path, so the
# container can run with a read-only root filesystem. On failure, fall back to the
# bundled placeholder instead of crash-looping.
if wget -q -T 10 -O "${OUT}.tmp" "https://ipinfo.io/json?token=${IPINFO_TOKEN:-}"; then
  mv "${OUT}.tmp" "$OUT"
else
  echo "whereami: ipinfo lookup failed; serving the bundled placeholder." >&2
  rm -f "${OUT}.tmp"
  cp "$SRC" "$OUT" 2>/dev/null || printf '{}\n' > "$OUT"
fi

exec "$@"
