#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/tikramarabia"
cd "$APP_DIR"

if [[ ! -f deploy/config/backend.env || ! -f deploy/config/postgres.env ]]; then
  echo "Missing deploy/config/backend.env or deploy/config/postgres.env"
  echo "Copy from .example files and fill in secrets."
  exit 1
fi

docker compose -p tikramarabia -f deploy/docker-compose.prod.yml up -d --build

echo "Tikram Arabia deploy complete."
echo "  Website   -> http://127.0.0.1:9081"
echo "  Dashboard -> http://127.0.0.1:9082"
echo "  API       -> http://127.0.0.1:9080"
echo ""
echo "If tikramarabia.com shows Mafateeh after an nginx recreate, run:"
echo "  bash deploy/scripts/sync-tikram-nginx.sh"
