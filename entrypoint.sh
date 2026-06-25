#!/bin/sh
set -eu

OUT=/tmp/ipinfo.json    # writable at runtime; what nginx serves (read-only-rootfs friendly)
TMP="${OUT}.tmp"

# curl (not busybox wget) so corporate proxies (HTTPS_PROXY) and a custom / MITM CA work:
# set WHEREAMI_CA_CERT (or the standard CURL_CA_BUNDLE) to a mounted corporate root CA.
fetch() {
  if [ -n "${WHEREAMI_CA_CERT:-}" ]; then
    curl -fsS --max-time 10 --cacert "$WHEREAMI_CA_CERT" -o "$TMP" "$1"
  else
    curl -fsS --max-time 10 -o "$TMP" "$1"
  fi
}

# Look up the server's IP info. Try the authenticated endpoint first, then fall back to
# the free (no-token) one — so a missing or INVALID IPINFO_TOKEN still yields real data
# instead of a misleading baked sample. Only if both fail do we serve an explicit error.
if [ -n "${IPINFO_TOKEN:-}" ] && fetch "https://ipinfo.io/json?token=${IPINFO_TOKEN}"; then
  :  # authenticated lookup OK
elif fetch "https://ipinfo.io/json"; then
  if [ -n "${IPINFO_TOKEN:-}" ]; then
    echo "whereami: IPINFO_TOKEN was rejected by ipinfo.io — used the free lookup instead." >&2
  fi
else
  echo "whereami: ipinfo.io lookup failed (offline or rate-limited)." >&2
  printf '%s\n' '{"error":"Could not reach ipinfo.io. If you set IPINFO_TOKEN, make sure it is valid — or leave it empty to use the free tier."}' > "$TMP"
fi

mv "$TMP" "$OUT"
exec "$@"
