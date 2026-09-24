<<<<<<< HEAD
# Website
=======
# Appetiser India

A product-led company website: Appetiser's charcoal and copper identity surrounds a distinct lavender and purple BitByte Restro experience.

## QUICK WEBSITE EDITING

All paths below are inside **`frontend/src`**, unless noted. Open the file, change the text between quotes, and save. Keep commas and quotation marks in place.

| What would you like to change? | Where to go |
| --- | --- |
| Company name, tagline, emails, phone, address or social links | `config/site.ts` |
| Homepage headline | `heroLines` in `config/site.ts` (one entry per line) |
| Homepage Spline scene | `heroSplineScene` in `config/site.ts` (an exported `.splinecode` URL) |
| Careers 3D model | `careersModel` in `config/site.ts`; model stored in `frontend/public/models/careers.glb` |
| Original Digital Core or Builder artwork | `coreImage` / `builderImage` in `config/site.ts` |
| BitByte copy, capabilities or product link | `data/products.ts` |
| Add another product | Add one object to `data/products.ts` |
| Feature a product on the homepage | Set `featured: true` in that product's object |
| Add a career opening | Add an object to `data/jobs.ts`, then set `isOpen: true` |
| Close a job | Change `isOpen` to `false` |
| Services, descriptions and deliverables | `data/services.ts` |
| Client work | `data/projects.ts`; set `published: true` only when ready |
| Testimonials | `data/testimonials.ts`; use `approved: true` with the speaker's permission |
| Company metrics | `data/stats.ts`; use `verified: true` for checked figures |
| Replace product/client images | `frontend/public/assets/products/` or `frontend/public/assets/projects/` |
| Colours, spacing and typography | `App.css` and `index.css` |

### Launching another product

1. Put its approved images in `frontend/public/assets/products/your-product/`.
2. Copy a product object in `data/products.ts`. Give it a unique `id` and `slug`.
3. Enter its name, tagline, description, accent, features and `content`.
4. Use paths such as `/assets/products/your-product/hero.webp` for images.
5. Set `featured: true` to show it on the homepage. Set `status: 'active'` only when it is available.
6. Save. `/products` and `/products/your-product` are generated automatically — no homepage or route edits needed.

Keep `websiteUrl: ''` until a real external product link exists. The site uses an internal product page or contact enquiry, never a made-up address. The generic detail page uses the product's editable overview, features and screenshots; BitByte has a dedicated interactive story.

### Adding a job

```ts
{
  id: 'unique-job-id',
  role: 'Your real role title',
  department: 'Engineering',
  location: 'India',
  type: 'Full-time',
  description: 'A short description of this actual opening.',
  isOpen: true,
}
```

The sample jobs currently have `isOpen: false`. They are not advertised as actual openings. Applications open the visitor's email app with a prefilled subject. There is no resume upload. The careers address is configured only in `site.ts`; a blank dedicated careers email reuses the contact email.

### Visual assets and product accuracy

- No Mal or BitByte screenshots were present in the attached asset collection. The site follows the written visual brief, not an unseen screenshot.
- The homepage uses a public [Spline robot demo](https://codepen.io/Johnxxx/pen/pvgyYvq) with a pause control. Replace `heroSplineScene` with your own exported `.splinecode` URL to personalise it. The scene loads separately from the main page; reduced-motion visitors see a static sculpture, and network/rendering failures fall back to local artwork. The Careers page displays the supplied GLB model with drag controls and optional automatic rotation. It has no embedded animation clips. Its Draco decoders are hosted locally in `frontend/public/models/draco/`.
- BitByte's previews are responsive HTML/CSS **illustrations**, visibly labelled. Its menu, cart and order preview demonstrate an interaction; they do not send real restaurant orders or take payments.
- BitByte's actual logo and screenshots are pending. Set `logo`, `heroImage` and `screenshots` in `products.ts` when approved assets are available. Update the illustrative UI against the supplied reference before representing it as the real interface.
- Only QR scanning, browsing a menu, placing orders, and restaurant dashboard/login access are presented as confirmed capabilities. The kitchen hand-off is explicitly marked as a proposed workflow for verification. Unconfirmed functionality is listed in `verificationNotes` and is not advertised as existing.
- Company metrics, testimonials and client work are intentionally empty rather than invented.
- Food photography is from Unsplash/Pexels and is used as illustrative menu content; all prices are demo prices.

### Contact enquiries

The contact form saves submissions in MongoDB, collection **`enquiries`**. It does not send email notifications yet. A success state appears only after the save succeeds.

Each record includes a reference ID, request ID, name, work email, optional company, selected interest, idea, budget, timeline, consent, UTC creation time and `status: 'new'`.

The API exposes **no public enquiry listing**, keeping contact details private. An authorised database operator can read enquiries in the configured database. There is not yet an admin inbox; add authenticated administration before exposing enquiry management through the website.

Validation includes field lengths, valid email, allowed selections and required consent. Repeated submission of the same request ID is idempotent. A per-email hourly limit and a honeypot offer basic spam protection; stronger shared rate limiting/CAPTCHA can be added if needed.

### Routes

`/` · `/products` · `/products/:slug` · `/services` · `/about` · `/careers` · `/contact`

Unknown routes and product slugs display a helpful 404 page. Navigation, links and product enquiries work without a user account.

### Development

- Frontend: React, TypeScript content/config files, React Router, Framer Motion, Lenis and shadcn UI components.
- Backend: FastAPI, Pydantic validation, Motor and MongoDB.
- Install frontend dependencies with `npm ci` from `frontend`, then run `npm start` or `npm run build`. Run `npm run lint` and `npm run typecheck` for code checks.
- For a local backend, create a virtual environment with `python3 -m venv backend/.venv`, then run `backend/.venv/bin/python -m pip install -r backend/requirements.txt` from the project root.
- Start MongoDB locally on port 27017, or configure an accessible MongoDB instance using `backend/.env.example` as a template for `backend/.env`. Start the API from the project root with `backend/.venv/bin/python -m uvicorn server:app --app-dir backend --reload --port 8001`.
- Frontend API origin uses `REACT_APP_BACKEND_URL` when provided. Otherwise requests use `/api`, which the development server proxies to `http://localhost:8001`. Production hosting must proxy `/api` to the backend or provide the backend URL at build time.
- Backend reads `MONGO_URL`, `DB_NAME` and `CORS_ORIGINS`, with local defaults matching `backend/.env.example`. Keep existing deployment environment values. MongoDB must be reachable before starting the API.
- Backend routes: `GET /api/health`, `GET /api/`, `POST /api/enquiries`.
- No authentication or third-party API credentials are needed for this version.

### Accessibility and motion

Keyboard navigation, visible focus, skip navigation, labelled forms, enquiry error feedback and semantic page landmarks are included. The site respects `prefers-reduced-motion`; Lenis is disabled in that mode. The mobile menu closes with Escape. Service rows can be navigated with arrow keys.

### Next additions

1. Approved BitByte branding/screenshots, actual product URL and optional original Spline scenes.
2. Email notifications and a private enquiry inbox.
3. OpenAI project-brief assistance — explicitly deferred until after the website, as requested.
>>>>>>> a74d1a2 (Launch Appetiser India website)
