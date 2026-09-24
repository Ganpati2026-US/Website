# Appetiser India — Product Requirements

## Original problem statement
Build a premium, product-led website for "Appetiser India" — a technology company that builds its own products (BitByte Restro) and partners with businesses.
- Awwwards-level design: near-black theme, large kinetic typography, premium motion (framer-motion), momentum scrolling (lenis).
- Distinct identities: Appetiser (black / charcoal / warm white / muted grey / warm accent) vs BitByte Restro (purple / white / soft lavender).
- Data-driven, easy to edit: `src/config/site.ts`, `src/data/{products,services,jobs,projects,stats,testimonials}.ts`.
- Homepage story: Hero → Digital Core → Philosophy → Our Products → BitByte interactive story → Services → Process → Careers → CTA.
- Pages: Home, Products, Product detail (`/products/bitbyte-restro`), Services, About, Careers, Contact.
- Contact form submissions saved directly to MongoDB.
- User decision (June 2026): **Do NOT add ChatGPT / AI model integration.** Finish the website only.

## Architecture
- Frontend: React 19 (CRA + craco), framer-motion, lenis, lucide-react, shadcn/ui, react-router-dom 7.
- Backend: FastAPI + Motor. `POST /api/enquiries` (validated, honeypot, idempotent request_id, per-email rate limit 5/hour). `GET /api/health`.
- DB: MongoDB `enquiries` collection: {id, request_id, name, work_email, company, interest, idea, budget, timeline, consent, status, created_at}.

## Implemented (as of June 2026)
- All 7 pages with kinetic hero typography, reveal animations, Lenis momentum scroll, reduced-motion support.
- BitByte Restro spotlight (desktop + phone illustrative preview) and 4-scene scroll-driven interactive story (Scan → Browse → Order → Restaurant) with a working demo menu/cart.
- Contact form with client + server validation, success receipt, error handling, deep-link prefill (`?interest=`, `?service=`).
- Careers page driven by `jobs.ts` (`isOpen` flag), mailto application links.
- Fixed: tsconfig/jsconfig conflict crash; broken Unsplash pasta image.
- Editing guide added to `/app/frontend/README.md` ("Quick website editing").
- Careers "The Builder" visual replaced with a dynamic video: seamless 11s dark liquid-chrome loop (Pexels, free licence) trimmed/compressed with ffmpeg to `public/videos/builder-loop.{mp4,webm}` (~2MB) + poster; autoplay/muted/loop/playsInline, copper tint overlay, reduced-motion falls back to poster. Configured via `site.builderVideo`.
- Security audit (June 2026): fixed Medium (per-IP rate limit 10/hr via sha256 ip_hash) + added security headers middleware on API; wildcard CORS is env-driven (`CORS_ORIGINS`) — restrict to site origin in production. Verified by testing agent (iteration_2, 13/13).
- Brand wordmark: capital "A" (copper) and animated reveal — mark pops in, letters cascade from blur, INDIA tracks in, copper spark line; hover tilt. `Wordmark` in Primitives.jsx, used in nav (animated) and footer (static).
- Careers open roles live: Tech (Web Developer, Business Analyst, Data Analyst interns) and Business (Sales, Social Media Management interns) as filter tabs; apply via mailto to `careersEmail || contactEmail`. Wordmark: capital A no longer copper; INDIA centred under name.
- Homepage "Digital Core" hero visual also replaced with a looping dark chrome-cube video (`core-loop.{mp4,webm}`, ~1.5MB) with radial mask + lighten blend + copper glow; `site.coreVideo`. Both stages share the video block in `DigitalCore.jsx`.

## Backlog
- P1: Replace illustrative BitByte previews with real product screenshots/logo once provided (`products.ts` → `logo`, `heroImage`, `screenshots`).
- P1: Add real Spline scene URL in `site.ts` (`splineUrl`) if desired.
- P2: Admin view / export for enquiries.
- P2: Social links in `site.ts`.
