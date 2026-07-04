#!/usr/bin/env bash
set -euo pipefail

# One-time VPS bootstrap for Tikram Arabia (keeps Mafateeh untouched).

APP_DIR="/opt/tikramarabia"
REPO="${REPO:-https://github.com/MafateehITBU/tekramWebsite.git}"

echo "==> Creating $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [[ ! -d .git ]]; then
  git clone "$REPO" .
else
  echo "==> Repo already present, skipping git pull (run manually if needed)"
fi

echo "==> Creating config from examples (edit secrets before first deploy)"
if [[ ! -f deploy/config/backend.env ]]; then
  cp deploy/config/backend.env.example deploy/config/backend.env
fi
if [[ ! -f deploy/config/postgres.env ]]; then
  cp deploy/config/postgres.env.example deploy/config/postgres.env
fi
chmod 600 deploy/config/backend.env deploy/config/postgres.env 2>/dev/null || true

chmod +x deploy/scripts/*.sh

echo ""
echo "Next steps:"
echo "  1. Edit $APP_DIR/deploy/config/backend.env and postgres.env (same DB password)"
echo "  2. bash $APP_DIR/deploy/scripts/deploy.sh"
echo "  3. Copy deploy/nginx/templates/tikramarabia.conf to /opt/mafateehwebsite/deploy/nginx/conf.d/"
echo "  4. bash deploy/scripts/issue-ssl-tikram.sh your@email.com"
echo "  5. Install GitHub self-hosted runner (see DEPLOYMENT-TIKRAM.md)"
