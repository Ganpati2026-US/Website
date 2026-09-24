# Appetiser India — Website

React (CRA + craco) frontend with framer-motion and Lenis. Backend: FastAPI + MongoDB (`/app/backend`).

## Quick website editing (no coding needed)

All copy, links and lists live in plain data files. Edit the text between the quotes, save, and the site updates.

| What you want to change | File |
|---|---|
| Company name, hero headline, contact email, address, social links, SEO title | `src/config/site.ts` |
| Products (BitByte Restro etc.), taglines, features, logo, screenshots, live URL | `src/data/products.ts` |
| Services offered | `src/data/services.ts` |
| Open job roles (set `isOpen: true` to publish a role) | `src/data/jobs.ts` |
| Case studies / projects | `src/data/projects.ts` |
| Stats / numbers | `src/data/stats.ts` |
| Testimonials | `src/data/testimonials.ts` |

### Common tasks
- **Change the hero headline**: edit `heroLines` in `site.ts` (two lines; the second line is highlighted).
- **Publish or close a job**: in `jobs.ts` set `isOpen: true/false`. Roles are grouped by `department` (`'Tech'` or `'Business'` — add a new name to `departments` to create a new tab). Applications go to `careersEmail` (falls back to `contactEmail`) with the role pre-filled in the subject.
- **Add BitByte's real logo / screenshots**: in `products.ts` set `logo`, `heroImage` and add `{ src, alt }` items to `screenshots`. Set `websiteUrl` to link "Explore BitByte" to the live product.
- **Add a new product**: copy the BitByte object in `products.ts`, change `id`/`slug`/`name`/`accent`. It appears on `/products` and gets its own page at `/products/<slug>`.
- **Change the Careers video**: drop new `builder-loop.mp4` / `.webm` / `builder-poster.jpg` into `public/videos/` (or edit `builderVideo` paths in `site.ts`). The homepage hero video works the same way via `coreVideo` (`core-loop.*`). Keep clips short (~10s) and under ~3MB. Set the paths to `''` to fall back to the static images.

### Where enquiries go
Contact form submissions are saved in MongoDB (`enquiries` collection) via `POST /api/enquiries`.

## Scripts
- `yarn start` — development server
- `yarn build` — production build
