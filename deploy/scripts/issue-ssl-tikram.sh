#!/usr/bin/env bash
set -euo pipefail

# Issue Let's Encrypt cert for Tikram domains using the Mafateeh certbot stack.
# Run from /opt/mafateehwebsite after DNS points to this VPS.

MAFATEEH_DIR="${MAFATEEH_DIR:-/opt/mafateehwebsite}"
EMAIL="${1:-}"

if [[ -z "$EMAIL" ]]; then
  echo "Usage: bash deploy/scripts/issue-ssl-tikram.sh your@email.com"
  exit 1
fi

cd "$MAFATEEH_DIR"

docker compose -f deploy/docker-compose.prod.yml --profile ssl run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d tikramarabia.com \
  -d www.tikramarabia.com \
  -d api.tikramarabia.com \
  -d dashboard.tikramarabia.com \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email

docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload

echo "SSL issued. Copy deploy/nginx/templates/tikramarabia.conf to Mafateeh nginx and reload."
