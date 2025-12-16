#!/bin/sh
set -euo pipefail

IPINFO_TOKEN="${IPINFO_TOKEN:-}"

wget "https://ipinfo.io/json?token=${IPINFO_TOKEN}" -q -O ipinfo.json -P /usr/share/nginx/html/

exec "$@"
