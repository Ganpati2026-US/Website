import { useEffect, useLayoutEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ArrowUp } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { Action, Wordmark } from './Primitives';
import { site } from '../config/site';

const links = [['Home', '/'], ['Products', '/products'], ['Services', '/services'], ['About', '/about'], ['Careers', '/careers']];

export const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useLayoutEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { let previous; const update = () => { const next = window.scrollY > 24; if (next !== previous) { previous = next; setScrolled(next); } }; update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => { if (!open) return; const close = e => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [open]);
  return <nav className={`navigation ${scrolled ? 'nav-scrolled' : ''}`} aria-label="Main navigation" data-testid="main-navigation">
    <div className="nav-inner"><Link to="/" className="brand" aria-label="Appetiser India home" data-testid="nav-brand"><Wordmark id="nav-wordmark" /></Link>
      <div className="desktop-nav">{links.map(([label, path]) => <NavLink end={path === '/'} to={path} data-testid={`nav-${label.toLowerCase()}`} key={path}>{label}</NavLink>)}</div>
      <div className="nav-right"><Action id="nav-start-project" variant="nav" arrow="up">Contact us</Action><button className="menu-toggle" data-testid="mobile-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    </div>
    <AnimatePresence>{open && <motion.div id="mobile-menu" className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{links.map(([label, path], i) => <NavLink onClick={() => setOpen(false)} to={path} end={path === '/'} key={path} data-testid={`mobile-nav-${label.toLowerCase()}`}><span>0{i + 1}</span>{label}<ArrowUpRight /></NavLink>)}</motion.div>}</AnimatePresence>
  </nav>;
};

export const Footer = () => <footer className="footer container" data-testid="footer"><div className="footer-top"><div><Link to="/" className="brand" aria-label="Appetiser India home" data-testid="footer-brand"><Wordmark id="footer-wordmark" animate={false} /></Link><p data-testid="footer-description">Independent minds.<br />Exceptional products.</p></div><div className="footer-links"><span className="small-label">EXPLORE</span>{links.filter(([label]) => label !== 'Home').map(([label, path]) => <Link data-testid={`footer-${label.toLowerCase()}`} key={path} to={path}>{label}</Link>)}</div><div className="footer-contact"><span className="small-label">HAVE SOMETHING IN MIND?</span><a data-testid="footer-email" href={`mailto:${site.contactEmail}`}>{site.contactEmail}<ArrowUpRight size={18} /></a><p data-testid="footer-address">{site.address}</p>{site.socialLinks.map(social => <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" data-testid={`social-${social.label.toLowerCase()}`}>{social.label}<ArrowUpRight size={14} /></a>)}</div></div><div className="footer-bottom"><span data-testid="copyright">© {new Date().getFullYear()} {site.companyName}</span><span className="footer-note">Made with intention.</span><button data-testid="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Back to top <ArrowUp size={14} /></button></div></footer>;

export const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const touch = window.matchMedia('(pointer: coarse)');
    let lenis;
    const update = () => {
      lenis?.destroy();
      lenis = touch.matches ? null : new Lenis({ autoRaf: true, duration: .75, smoothWheel: true, anchors: { offset: -100 } });
    };
    update();
    touch.addEventListener('change', update);
    return () => { touch.removeEventListener('change', update); lenis?.destroy(); };
  }, [reduced]);
  useLayoutEffect(() => {
    if (hash) { const timer = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }), 100); return () => clearTimeout(timer); }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return undefined;
  }, [pathname, hash, reduced]);
  return null;
};

export const SEO = ({ title, description }) => {
  useEffect(() => {
    document.title = title ? `${title} — ${site.companyName}` : site.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || site.seo.description);
  }, [title, description]);
  return null;
};
