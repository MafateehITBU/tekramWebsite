#!/usr/bin/env bash
# Sync Tikram nginx config into Mafateeh reverse-proxy and reload.
# Run after recreating deploy-reverse-proxy-1 or if tikramarabia.com shows Mafateeh.
set -euo pipefail

TIKRAM_DIR="${TIKRAM_DIR:-/opt/tikramarabia}"
MAFATEEH_DIR="${MAFATEEH_DIR:-/opt/mafateehwebsite}"
TEMPLATE="$TIKRAM_DIR/deploy/nginx/templates/tikramarabia.conf"
TARGET="$MAFATEEH_DIR/deploy/nginx/conf.d/tikramarabia.conf"
COMPOSE_FILE="$MAFATEEH_DIR/deploy/docker-compose.prod.yml"

if [[ ! -f "$TEMPLATE" ]]; then
  echo "Missing template: $TEMPLATE"
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing compose file: $COMPOSE_FILE"
  exit 1
fi

GATEWAY_IP="$(docker compose -f "$COMPOSE_FILE" exec -T reverse-proxy ip route 2>/dev/null | awk '/default/ {print $3}')"
if [[ -z "$GATEWAY_IP" ]]; then
  echo "Could not detect docker gateway IP; using 172.18.0.1"
  GATEWAY_IP="172.18.0.1"
fi

echo "Using docker gateway IP: $GATEWAY_IP"
sed "s/172\\.17\\.0\\.1/$GATEWAY_IP/g" "$TEMPLATE" > "$TARGET"

echo "Wrote $TARGET"

docker compose -f "$COMPOSE_FILE" exec -T reverse-proxy nginx -t
docker compose -f "$COMPOSE_FILE" up -d --force-recreate reverse-proxy

sleep 2
echo ""
echo "Health check:"
curl -sfI http://127.0.0.1:9081 | head -1 || echo "  WARNING: Tikram website port 9081 not responding"
curl -sfI http://127.0.0.1:9082 | head -1 || echo "  WARNING: Tikram dashboard port 9082 not responding"
curl -skf "https://tikramarabia.com/" | grep -o '<title>[^<]*</title>' || echo "  WARNING: tikramarabia.com check failed"
curl -skf "https://dashboard.tikramarabia.com/" | grep -o '<title>[^<]*</title>' || echo "  WARNING: dashboard check failed"
echo ""
echo "Tikram nginx sync complete."
