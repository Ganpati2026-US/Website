# Appetiser launch experience

The launch sequence lives in `frontend/src/components/LaunchExperience.jsx` and
its matching stylesheet. It reuses the site's existing `Wordmark` and Framer
Motion; no runtime dependency or logo asset has been added.

Open the homepage normally for the first-visit experience. The session key
`appetiser.launch.v1` prevents the intro from repeating on refresh or return
navigation. Other pages remain directly accessible. If storage is unavailable,
a memory flag prevents repeats during the same app run.

## Preview controls

- Replay: `http://localhost:3000/?intro=replay`
- Skip for development: `http://localhost:3000/?intro=skip`
- Press Escape or use the keyboard-accessible Skip button to finish immediately.
- Enable the browser's reduced-motion preference to bypass the full intro.

Replay is intentionally URL-based so desktop and mobile browsers can both test
it without developer-console access. The query parameter does not persist.

## Timing and handoff

Desktop: idea at 450ms, convergence at 1700ms, brand at 2200ms, handoff at
3000ms. The logo lands around 3700ms, then the two hero lines reveal in sequence.
Mobile and touch devices: 220ms, 1050ms, 1350ms, 1900ms, landing around 2500ms.
Mobile uses six nodes rather than twenty, with no animated text blur.

The moving wordmark uses the real navbar wordmark's measured bounds and the
same component/styles. Measurement updates after fonts load or the viewport
resizes. The actual navbar wordmark stays hidden until the moving version lands.
The animation completion releases the page; a separate timeout provides a
fallback. Navigation away, Escape, Skip, reduced motion, and backgrounding the
tab also release the page immediately.

The homepage keeps its layout and copy. Its hero reveal waits for the logo,
and its heavier 3D scene loads only after the launch has finished. The
`ScrollManager` waits too, so native scroll locking and Lenis do not compete.

The small HTML bootstrap prevents an initial flash of the homepage. It has a
five-second fallback and leaves pages visible if storage access fails.

## Verification

Check fresh-session desktop and mobile visits, the wordmark landing, refreshes,
return navigation, reduced motion, keyboard Skip and Escape, scrolling after
completion, viewport resizing, and direct links to other pages. Run the normal
frontend build, lint, typecheck, and tests before shipping.
