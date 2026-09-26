import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Wordmark } from './Primitives';
import './LaunchExperience.css';

const SESSION_KEY = 'appetiser.launch.v1';
const EASE = [.22, 1, .36, 1];
let seenInMemory = false;
const LaunchContext = createContext({ active: false, phase: 'complete', compact: false });
export const useLaunchExperience = () => useContext(LaunchContext);

function shouldLaunch(pathname) {
  if (!['/', '/home'].includes(pathname) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const replay = new URLSearchParams(window.location.search).get('intro');
  if (replay === 'skip') return false;
  if (replay === 'replay') return true;
  try { return !seenInMemory && !sessionStorage.getItem(SESSION_KEY); }
  catch { return !seenInMemory; }
}

const NODES = Array.from({ length: 20 }, (_, index) => {
  const angle = index * 2.399963;
  const radius = 85 + (index % 5) * 22;
  return { x: Math.cos(angle) * radius * 1.25, y: Math.sin(angle) * radius * .65, size: index % 4 === 0 ? 3 : 2 };
});

export function LaunchExperience({ children }) {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(() => shouldLaunch(pathname) ? 'dark' : 'complete');
  const [compact] = useState(() => window.matchMedia('(max-width: 900px), (pointer: coarse)').matches);
  const [geometry, setGeometry] = useState(null);
  const active = phase !== 'complete';
  const skipRef = useRef(null);
  const restoreFocus = useRef(false);

  const finish = useCallback(() => {
    restoreFocus.current = document.activeElement === skipRef.current;
    setPhase('complete');
  }, []);

  useLayoutEffect(() => {
    // The HTML bootstrap only hides the shell until React can paint the intro.
    delete document.documentElement.dataset.launchPending;
    clearTimeout(window.__appetiserLaunchGuard);
    delete window.__appetiserLaunchGuard;
    if (!['/', '/home'].includes(pathname)) setPhase('complete');
    else if (shouldLaunch(pathname)) setPhase(current => current === 'complete' ? 'dark' : current);
  }, [pathname]);

  useEffect(() => { if (reduced) finish(); }, [reduced, finish]);

  useLayoutEffect(() => {
    if (!active) return;
    let cancelled = false;
    const target = document.querySelector('[data-testid="nav-wordmark"]');
    if (!target) { finish(); return; }
    const measure = () => {
      if (cancelled) return;
      const rect = target.getBoundingClientRect();
      const scale = Math.min(compact ? 2.65 : 3.8, (window.innerWidth - 48) / rect.width);
      setGeometry({
        from: { x: (window.innerWidth - rect.width * scale) / 2, y: window.innerHeight * .46 - rect.height * scale / 2, scale },
        to: { x: rect.left, y: rect.top, scale: 1 },
        taglineTop: window.innerHeight * .46 + rect.height * scale / 2 + (compact ? 22 : 34),
      });
    };
    measure();
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    document.fonts?.ready.then(measure);
    return () => { cancelled = true; observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [active, compact, finish]);

  useLayoutEffect(() => {
    if (!active) {
      if (restoreFocus.current) {
        document.querySelector('[data-testid="nav-brand"]')?.focus({ preventScroll: true });
        restoreFocus.current = false;
      }
      return;
    }
    seenInMemory = true;
    try { sessionStorage.setItem(SESSION_KEY, 'seen'); } catch { /* Private browsing can disable storage. */ }
    const overflow = document.body.style.overflow;
    const header = document.querySelector('[data-testid="main-navigation"]');
    const headerRight = header?.style.right;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    // Safari can expand fixed headers when the scrollbar disappears, even with
    // a stable document gutter. Keep the header at its eventual unlocked width.
    if (header) {
      if (gutter > 0) header.style.right = `${gutter}px`;
    }
    const schedule = compact
      ? [[220, 'idea'], [1050, 'formation'], [1350, 'brand'], [1900, 'handoff']]
      : [[450, 'idea'], [1700, 'formation'], [2200, 'brand'], [3000, 'handoff']];
    const timers = schedule.map(([time, next]) => setTimeout(() => setPhase(next), time));
    // Always release the page even if the visual sequence cannot finish.
    timers.push(setTimeout(finish, compact ? 3200 : 4500));
    const onKey = event => {
      if (event.key === 'Escape') finish();
      // Safari's default keyboard setting can skip buttons on the first Tab.
      if (event.key === 'Tab' && document.activeElement !== skipRef.current) {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };
    const onVisibility = () => { if (document.hidden) finish(); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = overflow;
      if (header) header.style.right = headerRight;
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active, compact, finish]);

  const idea = phase === 'idea';
  const brand = phase === 'brand' || phase === 'handoff';
  const handoff = phase === 'handoff';
  return <LaunchContext.Provider value={{ active, phase, compact }}>
    <div className={`site-shell ${active ? 'launch-active' : ''} ${handoff ? 'launch-revealing' : ''}`} inert={active ? '' : undefined}>{children}</div>
    {active && <section className={`launch-experience ${compact ? 'launch-compact' : ''} launch-phase-${phase}`} aria-label="Appetiser India introduction" data-testid="launch-experience">
      <motion.div className="launch-backdrop" aria-hidden="true" initial={false} animate={{ opacity: handoff ? 0 : 1 }} transition={{ duration: compact ? .5 : .65, ease: EASE }}>
        <div className="launch-ambient ambient-purple" /><div className="launch-ambient ambient-copper" /><div className="launch-ambient ambient-green" />
      </motion.div>
      <div className="launch-art" aria-hidden="true">
        <div className="launch-nodes">
          <motion.i className="launch-spark" initial={{ opacity: 0 }} animate={{ opacity: idea ? [0, .8, .4, .7] : 0, scale: idea ? [1, 1.35, 1] : 1 }} transition={{ duration: compact ? .6 : 1 }} />
          {NODES.slice(0, compact ? 6 : 20).map((node, index) => <motion.i className={`launch-node node-${index % 3}`} key={index} style={{ width: node.size, height: node.size }} initial={{ opacity: 0, x: node.x, y: node.y }} animate={{
            opacity: idea ? .25 + (index % 3) * .12 : 0,
            x: phase === 'formation' || brand ? 0 : node.x,
            y: phase === 'formation' || brand ? 0 : node.y,
            scale: phase === 'formation' ? .4 : 1,
          }} transition={{ duration: phase === 'formation' ? .5 : .7, delay: idea ? index * (compact ? .04 : .025) : 0, ease: phase === 'formation' ? [.55, .05, .8, .4] : EASE }} />)}
        </div>
        <motion.p className="launch-idea" initial={{ opacity: 0, y: 9 }} animate={{ opacity: idea ? 1 : 0, y: idea ? 0 : phase === 'formation' ? -6 : 9, filter: compact ? 'none' : idea ? 'blur(0px)' : 'blur(4px)' }} transition={{ duration: compact ? .3 : .5, ease: EASE }}>It starts with an idea.</motion.p>
        {geometry && <motion.div className="launch-logo" onAnimationComplete={() => { if (handoff) finish(); }} initial={{ ...geometry.from, opacity: 0 }} animate={{ ...(handoff ? geometry.to : geometry.from), opacity: brand ? 1 : 0 }} transition={{ duration: handoff ? (compact ? .6 : .7) : .45, ease: EASE }}>
          <Wordmark id="launch-wordmark" animate={false} />
        </motion.div>}
        {geometry && <motion.p className="launch-tagline" style={{ top: geometry.taglineTop }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: phase === 'brand' ? 1 : 0, y: phase === 'brand' ? 0 : 6 }} transition={{ duration: .35, ease: EASE }}>From India. Built for everywhere.</motion.p>}
      </div>
      <button ref={skipRef} className="launch-skip" onClick={finish} aria-label="Skip introduction">Skip <span aria-hidden="true">↗</span></button>
    </section>}
  </LaunchContext.Provider>;
}
