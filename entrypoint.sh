#!/bin/sh
set -euo pipefail

wget 'https://ipinfo.io/json?token=5915d8f95c120e' -q -O ipinfo.json -P /usr/share/nginx/html/

exec "$@"
