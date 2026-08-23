# Production Test Results — Tikram Arabia

**Date:** 20 August 2026  
**Production:** https://www.tikramarabia.com  
**Local commit:** see `git rev-parse --short HEAD`

## Baseline (production before SEO redeploy)

| URL | HTTP | Notes |
|-----|------|-------|
| `/` | 200 | Minimal HTML shell (~967 bytes pre-deploy) |
| `/contact` | 200 | **VERIFIED** — contact page exists |
| `/robots.txt` | 200 | Returns HTML SPA (not plain text) until deploy |
| `/sitemap.xml` | 200 | Returns HTML SPA until deploy |
| `/ar/about` | 200 | SPA shell; locale routing after deploy |
| `/invalid-xyz-123` | 200 | CSR fallback — PARTIAL |
| `/wp-admin` | 200 | Probe 404 in nginx config; not live until deploy |

See `curl-results/route-status.txt` for full matrix.

## Code implementation (local, build PASS)

- robots.txt, sitemap.xml, site.webmanifest (static)
- SeoHead / SeoManager / JSON-LD / route SEO
- `/ar` locale URLs + LocalizedLink
- Cookie consent + GA4 consent gating
- Accessibility page EN+AR
- nginx security headers + probe 404s
- Reverse-proxy template (HTTPS, www→apex, HSTS)

## Next step

Push to `main` → self-hosted runner deploy → re-run `python scripts/tikram_closure_audit.py` to refresh production evidence.
