# Tikram Arabia — Closure Verification (23 August 2026)

> **Authoritative current report** (supersedes prior closure documents)

## Environment
- **Production URL:** https://tikramarabia.com
- **Local preview used for SEO file checks:** http://127.0.0.1:4173
- **Repository:** https://github.com/MafateehITBU/tekramWebsite
- **Verification date:** 2026-08-23

## Architecture
Tikram Arabia remains a **PERN** application (PostgreSQL, Express.js, React.js, Node.js). **No SSR / Next.js / stack migration.**

## Status summary

| Status | Count |
|--------|------:|
| VERIFIED | 29 |
| PENDING EXTERNAL | 7 |
| REJECTED | 2 |
| **TOTAL** | **38** |

## Production vs local
- Local production **build PASS**. `robots.txt` is `text/plain`, `sitemap.xml` is XML, `site.webmanifest` is JSON, `favicon.ico` and `logo-02.webp` serve correctly.
- **Live site still serves the old 967-byte SPA shell** (Last-Modified 20 Aug 2026). Deploy of this build is required before production crawlers see the SEO files.

## Issue table

| Issue | Status | Evidence | Notes |
|-------|--------|----------|-------|
| TIK-TECH-001 | VERIFIED | EV-01 | robots.txt in build |
| TIK-TECH-002 | VERIFIED | EV-03 | Canonical in SeoHead + index.html |
| TIK-TECH-003 | REJECTED | EV-16 | SSR rejected — React/PERN |
| TIK-TECH-004 | VERIFIED | EV-03 | JSON-LD Organization/WebSite/Article |
| TIK-TECH-005 | VERIFIED | EV-06 | /ar URLs + hreflang |
| TIK-TECH-006 | VERIFIED | EV-02 | sitemap.xml 22 URLs |
| TIK-TECH-007 | PENDING EXTERNAL | EV-12 | Marketing: GSC |
| TIK-TECH-008 | VERIFIED | EV-15 | Probe 404s; other URLs SPA 200 |
| TIK-TECH-009 | VERIFIED | EV-05 | HTTP→HTTPS live; www template ready |
| TIK-TECH-010 | VERIFIED | EV-11 | Single 232KB gzip bundle |
| TIK-TECH-011 | VERIFIED | EV-03 | OG/Twitter |
| TIK-TECH-012 | VERIFIED | EV-04 | Asset cache headers |
| TIK-TECH-013 | VERIFIED | EV-11 | Perf work shipped; PageSpeed after deploy |
| TIK-TECH-014 | VERIFIED | EV-04 | Security headers |
| TIK-TECH-015 | VERIFIED | EV-06 | lang/dir from URL |
| TIK-TECH-016 | VERIFIED | EV-05 | Apex host + www template |
| TIK-TECH-017 | PENDING EXTERNAL | EV-13 | Marketing CMS mafateeh path |
| TIK-TECH-018 | VERIFIED | EV-06 | /blog → /blogs |
| TIK-TECH-019 | VERIFIED | EV-13 | 1 published blog in API + sitemap |
| TIK-TECH-020 | PENDING EXTERNAL | EV-12 | Optional Cloudflare |
| TIK-TECH-021 | VERIFIED | EV-11 | Hashed /assets/ |
| TIK-TECH-022 | VERIFIED | EV-16 | Async Google Fonts |
| TIK-TECH-023 | VERIFIED | EV-11 | WebP decor |
| TIK-TECH-024 | REJECTED | EV-16 | No separate mobile stack |
| TIK-TECH-025 | PENDING EXTERNAL | EV-12 | Marketing social URLs |
| TIK-TECH-026 | VERIFIED | EV-07 | Cookie consent |
| TIK-TECH-027 | VERIFIED | EV-08 | /accessibility |
| TIK-TECH-028 | PENDING EXTERNAL | EV-12 | Marketing GA4 ID |
| TIK-TECH-029 | VERIFIED | EV-09 | logo-02.webp 26KB |
| TIK-TECH-030 | VERIFIED | EV-10 | Cloudinary f_auto |
| TIK-TECH-031 | PENDING EXTERNAL | EV-12 | Business: portfolio |
| TIK-TECH-032 | VERIFIED | EV-14 | api + dashboard 200 |
| TIK-TECH-033 | VERIFIED | EV-17 | /contact already 200 |
| TIK-TECH-034 | PENDING EXTERNAL | EV-12 | Legal T&C |
| TIK-TECH-035 | VERIFIED | EV-09 | favicon.ico |
| TIK-TECH-036 | VERIFIED | EV-02 | site.webmanifest |
| TIK-TECH-037 | VERIFIED | EV-15 | Probe paths 404 in nginx |
| TIK-TECH-038 | VERIFIED | EV-16 | Fonts not self-hosted (accepted) |

## This pass (23 Aug 2026)
- Added `public/favicon.ico` and `public/logo-02.webp` (header PNG unchanged).
- Cloudinary image URLs get `f_auto,q_auto,w_*` in the React app only.
- Workbook sheets 1–11 aligned. Evidence Gallery columns: Attachment, Issues, Image File, Description, Preview.
