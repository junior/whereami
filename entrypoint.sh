#!/bin/sh
set -eu

TARGET=/usr/share/nginx/html/ipinfo.json

# Best-effort refresh of the server's own IP info. If the lookup fails (offline,
# rate-limited, DNS), keep the placeholder baked into the image so nginx still starts
# and serves the app instead of crash-looping.
if wget -q -T 10 -O "${TARGET}.tmp" "https://ipinfo.io/json?token=${IPINFO_TOKEN:-}"; then
  mv "${TARGET}.tmp" "$TARGET"
else
  echo "whereami: ipinfo lookup failed; serving the bundled placeholder." >&2
  rm -f "${TARGET}.tmp"
fi

exec "$@"
