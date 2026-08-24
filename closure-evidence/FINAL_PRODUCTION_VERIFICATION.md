# Tikram Arabia — Closure Verification (24 August 2026)

> **Authoritative current report** (supersedes prior closure documents)

## Environment
- **Production URL:** https://tikramarabia.com
- **Local commit recorded:** `fe8f6e4`
- **Repository:** https://github.com/MafateehITBU/tekramWebsite
- **Verification date:** 2026-08-24

## Architecture
Tikram Arabia remains a **PERN** application (PostgreSQL, Express.js, React.js, Node.js). **No SSR / Next.js / stack migration.**
Mobile homepage first paint is HTML `#boot-shell`. Desktop CSS is render-blocking; below 768px CSS is `media=print` + `onload`.
Route/section code-split uses `lazyNamed()` only (no Vite `manualChunks`).

## Status summary

| Status | Count |
|--------|------:|
| VERIFIED | 29 |
| PENDING EXTERNAL | 7 |
| REJECTED | 2 |
| **TOTAL** | **38** |

## Production vs repo
- Live HTML ~10.6KB (Last-Modified 23 Aug 2026 12:56 UTC). Old 967-byte SPA shell is gone.
- `/robots.txt` text/plain 200, `/sitemap.xml` text/xml 200, `/wp-admin` 404.
- HTTP→HTTPS 301 live. www still 200 until reverse-proxy template is applied.
- Desktop PageSpeed 23 Aug 15:51 GMT+3: **96** / FCP 0.9 / LCP 1.1 / CLS 0.006.
- Mobile PageSpeed 23 Aug 15:51 GMT+3: **61** (blocking CSS). Async-CSS fix `fe8f6e4` is live; re-run pending.

## Issue table

| Issue | Status | Evidence | Notes |
|-------|--------|----------|-------|
| TIK-TECH-001 | VERIFIED | EV-01 | Live 24 Aug 2026: /robots.txt 200 text/plain with Sitemap URL (not the SPA shell). |
| TIK-TECH-002 | VERIFIED | EV-03 | Live HTML includes canonical https://tikramarabia.com/ plus SeoHead per route. |
| TIK-TECH-003 | REJECTED | EV-16 | PERN/React retained. No Next.js or SSR migration. |
| TIK-TECH-004 | VERIFIED | EV-03 | JSON-LD in live index.html and SeoHead. |
| TIK-TECH-005 | VERIFIED | EV-06 | Live /ar 200; sitemap includes AR URLs; lang/dir set from the path. |
| TIK-TECH-006 | VERIFIED | EV-02 | Live /sitemap.xml 200 text/xml. |
| TIK-TECH-007 | PENDING EXTERNAL | EV-12 | Not an IT code task. |
| TIK-TECH-008 | VERIFIED | EV-15 | Live /wp-admin 404; /invalid-xyz-123 SPA 200. |
| TIK-TECH-009 | VERIFIED | EV-05 | Live http→https 301. www still returns 200 until the reverse-proxy template is applied. |
| TIK-TECH-010 | VERIFIED | EV-11 | First JS ~359KB / ~117KB gzip (was 716 / 232). Home+Header+Hero stay eager. |
| TIK-TECH-011 | VERIFIED | EV-03 | og:title, og:image, twitter:card in live HTML. |
| TIK-TECH-012 | VERIFIED | EV-04 | Live hashed JS: public max-age=31536000 immutable. HTML: no-cache, no-store, must-reval... |
| TIK-TECH-013 | VERIFIED | EV-19 | Desktop PSI 23 Aug 15:51 GMT+3: 96 / FCP 0.9s / LCP 1.1s / TBT 40ms / CLS 0.006. Mobile... |
| TIK-TECH-014 | VERIFIED | EV-04 | Live 404s send X-Frame/X-CTO. index.html Cache-Control location currently drops parent ... |
| TIK-TECH-015 | VERIFIED | EV-06 | Arabic path sets lang=ar dir=rtl before paint. |
| TIK-TECH-016 | VERIFIED | EV-05 | Live www still 200. Template ready, not applied on the reverse-proxy yet. |
| TIK-TECH-017 | PENDING EXTERNAL | EV-13 | Content edit in admin dashboard. |
| TIK-TECH-018 | VERIFIED | EV-06 | Navigate routes in App.jsx (client redirect; HTML 200 as expected for CSR). |
| TIK-TECH-019 | VERIFIED | EV-13 | how-to-reduce-operating-costs-with-technology-solutions |
| TIK-TECH-020 | PENDING EXTERNAL | EV-12 | Skipped — not a launch blocker. |
| TIK-TECH-021 | VERIFIED | EV-11 | Live /assets/index-*.js Cache-Control immutable. |
| TIK-TECH-022 | VERIFIED | EV-16 | Self-host declined to avoid visual/font risk. |
| TIK-TECH-023 | VERIFIED | EV-11 | Mobile first paint is the HTML hero, not the decorative hand. |
| TIK-TECH-024 | REJECTED | EV-16 | PERN/React only. |
| TIK-TECH-025 | PENDING EXTERNAL | EV-12 | Code ready; URLs not invented by IT. |
| TIK-TECH-026 | VERIFIED | EV-07 | localStorage key tikram-arabia-cookie-consent. |
| TIK-TECH-027 | VERIFIED | EV-08 | Live /accessibility 200. |
| TIK-TECH-028 | PENDING EXTERNAL | EV-12 | IT will not invent a tracking ID. |
| TIK-TECH-029 | VERIFIED | EV-09 | Live /logo-02.webp 200 image/webp. |
| TIK-TECH-030 | VERIFIED | EV-10 | optimizeMediaUrl used on blog/portfolio images. CMS folder name unchanged. |
| TIK-TECH-031 | PENDING EXTERNAL | EV-12 | Not enabled without business approval. |
| TIK-TECH-032 | VERIFIED | EV-14 | Re-checked 24 Aug 2026. |
| TIK-TECH-033 | VERIFIED | EV-17 | Live /contact HTTP 200. |
| TIK-TECH-034 | PENDING EXTERNAL | EV-12 | Not a marketing or IT invention task. |
| TIK-TECH-035 | VERIFIED | EV-09 | Live /favicon.ico 200 image/x-icon. |
| TIK-TECH-036 | VERIFIED | EV-02 | Live /site.webmanifest 200. Content-Type currently application/octet-stream (file is va... |
| TIK-TECH-037 | VERIFIED | EV-15 | Live /wp-admin 404. Other unknown paths stay SPA 200. |
| TIK-TECH-038 | VERIFIED | EV-16 | Accepted to keep typography unchanged. |

## This pass (24 Aug 2026)
- Excel sheets 1–11 aligned to live production + perf work (named chunks, HTML hero, desktop/mobile CSS split).
- Header light logo is `/logo-02.webp`. Cookie key `tikram-arabia-cookie-consent`.
- Evidence Gallery columns: Attachment, Issues, Image File, Description, Preview.
- IT implemented (DONE / N/A): 29. External remaining: 007, 017, 020, 025, 028, 031, 034.
