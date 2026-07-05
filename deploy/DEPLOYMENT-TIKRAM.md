# Tikram Arabia deployment (parallel to Mafateeh)

Tikram runs in `/opt/tikramarabia` on ports **9080** (API), **9081** (website), **9082** (dashboard).  
Mafateeh stays in `/opt/mafateehwebsite` on **80/443**.

**VPS:** `ssh root@187.124.173.216`

## Domains

| Service | URL |
|---------|-----|
| Website | https://tikramarabia.com |
| API | https://api.tikramarabia.com |
| Dashboard | https://dashboard.tikramarabia.com |

## 1) DNS (Hostinger)

Point these A records to `187.124.173.216`:

- `@`, `www`, `api`, `dashboard` for `tikramarabia.com`

Do **not** change Mafateeh DNS.

## 2) First-time VPS setup

```bash
ssh root@187.124.173.216

git clone https://github.com/MafateehITBU/tekramWebsite.git /opt/tikramarabia
cd /opt/tikramarabia
bash deploy/scripts/setup-vps.sh
```

Edit secrets (use the **same** DB password in both files):

```bash
nano /opt/tikramarabia/deploy/config/postgres.env
nano /opt/tikramarabia/deploy/config/backend.env
chmod 600 /opt/tikramarabia/deploy/config/*.env
```

First deploy:

```bash
bash /opt/tikramarabia/deploy/scripts/deploy.sh
```

Verify local ports:

```bash
curl -I http://127.0.0.1:9081
curl -I http://127.0.0.1:9082
curl -I http://127.0.0.1:9080/api/public/static-site-info
```

## 3) Wire Tikram domains through Mafateeh nginx

Copy nginx config:

```bash
cp /opt/tikramarabia/deploy/nginx/templates/tikramarabia.conf \
   /opt/mafateehwebsite/deploy/nginx/conf.d/tikramarabia.conf
```

If Mafateeh reverse-proxy does not have `host.docker.internal`, add to `/opt/mafateehwebsite/deploy/docker-compose.prod.yml` under `reverse-proxy`:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

Then reload Mafateeh nginx:

```bash
cd /opt/mafateehwebsite
docker compose -f deploy/docker-compose.prod.yml up -d reverse-proxy
docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -t
docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload
```

## 4) SSL for Tikram domains

```bash
cd /opt/tikramarabia
bash deploy/scripts/issue-ssl-tikram.sh your@email.com
```

Test:

```bash
curl -I https://tikramarabia.com
curl -I https://api.tikramarabia.com/api/public/static-site-info
curl -I https://dashboard.tikramarabia.com
curl -I https://www.mafateehgroup.com
```

## 5) Auto-deploy on GitHub push

1. GitHub → **tekramWebsite** → Settings → Actions → Runners → **New self-hosted runner**
2. On VPS:

```bash
mkdir -p /opt/actions-runner-tikram && cd /opt/actions-runner-tikram
curl -o actions-runner-linux-x64-2.323.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-linux-x64-2.323.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.323.0.tar.gz

./config.sh \
  --url https://github.com/MafateehITBU/tekramWebsite \
  --token YOUR_RUNNER_TOKEN \
  --name tikram-vps \
  --labels self-hosted,linux,tikram \
  --work _work \
  --unattended

./svc.sh install && ./svc.sh start
```

Every push to `main` runs `.github/workflows/deploy-tikramarabia.yml` and rebuilds Tikram only.

## Default admin login

- Email: `admin@tikramarabia.com`
- Password: `ChangeMe_Admin123!` (change after first login)

## Manual redeploy

```bash
cd /opt/tikramarabia
git pull origin main
bash deploy/scripts/deploy.sh
```

## Tikram shows Mafateeh (wrong site on tikram domains)

After recreating Mafateeh `reverse-proxy`, Tikram routing in nginx may be missing or stale.

```bash
bash /opt/tikramarabia/deploy/scripts/sync-tikram-nginx.sh
```

Or manually:

```bash
GW=$(docker compose -f /opt/mafateehwebsite/deploy/docker-compose.prod.yml exec -T reverse-proxy ip route | awk '/default/ {print $3}')
sed "s/172\\.17\\.0\\.1/$GW/g" /opt/tikramarabia/deploy/nginx/templates/tikramarabia.conf \
  > /opt/mafateehwebsite/deploy/nginx/conf.d/tikramarabia.conf
cd /opt/mafateehwebsite
docker compose -f deploy/docker-compose.prod.yml up -d --force-recreate reverse-proxy
```

Expected: page title **Tikram Arabia** (not Mafateeh).
