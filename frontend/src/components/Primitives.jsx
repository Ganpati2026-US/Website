import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export const BrandMark = ({ className = '' }) => <svg className={className} width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="14" stroke="currentColor" strokeOpacity=".25" /><path d="M12 34 23 12h5L17 34h-5Zm14-12 10 12h-8l-5-6 3-6Z" fill="currentColor" /><circle cx="35" cy="13" r="3" fill="currentColor" /></svg>;

export const Wordmark = ({ id = 'brand-wordmark', animate = true }) => {
  const reduced = useReducedMotion();
  return <motion.span className="wordmark brand-refined" data-testid={id} initial={animate && !reduced ? { opacity: 0, y: -5 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} aria-label="Appetiser India">
    <span className="wordmark-text" aria-hidden="true"><span className="wordmark-name">Appetiser</span><span className="brand-country">INDIA</span></span>
  </motion.span>;
};

export const Reveal = ({ children, className = '', delay = 0, ...props }) => {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }} {...props}>{children}</motion.div>;
};

export const Eyebrow = ({ children, light = false, id = 'section-label' }) => <div data-testid={id} className={`eyebrow ${light ? 'light-label' : ''}`}>{children}</div>;

export const Action = ({ children, to = '/contact', variant = 'primary', id, arrow = 'right', ...props }) => {
  const external = /^(https?:|mailto:)/.test(to);
  const content = <>{children}{arrow === 'up' ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}</>;
  return <Button asChild className={`action action-${variant}`} {...props}>{external ? <a data-testid={id} href={to} {...(to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{content}</a> : <Link data-testid={id} to={to}>{content}</Link>}</Button>;
};

export const PageHero = ({ eyebrow, lines, description, children, accent = false, highlight = '', id = 'page' }) => {
  const reduced = useReducedMotion();
  if (id === 'careers' && !highlight) highlight = 'the future';
  return <header className="page-hero" data-testid={`${id}-hero`}>
    <Reveal><Eyebrow id={`${id}-eyebrow`}>{eyebrow}</Eyebrow></Reveal>
    <h1 className="display-heading" data-testid={`${id}-heading`}>{lines.map((line, i) => <span className="line-mask" key={line}><motion.span className={accent && i === 1 ? 'accent-text' : ''} initial={{ y: reduced ? 0 : '110%', rotate: reduced ? 0 : 3 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: .15 + i * .14, duration: 1.1, ease: [.22, 1, .36, 1] }}>{highlight && line.includes(highlight) ? <>{line.split(highlight)[0]}<span className={id === 'careers' ? 'ai-gradient-text' : 'accent-text'}>{highlight}</span>{line.split(highlight)[1]}</> : line}</motion.span></span>)}</h1>
    {description && <Reveal delay={.35}><p className="hero-description" data-testid={`${id}-description`}>{description}</p></Reveal>}
    {children && <Reveal delay={.5} className="hero-actions">{children}</Reveal>}
  </header>;
};

export const FinalCTA = () => <section className="final-cta container" data-testid="final-cta"><Reveal><Eyebrow id="final-cta-label">GREAT PRODUCTS START WITH A CONVERSATION</Eyebrow><h2 className="section-heading" data-testid="final-cta-heading">Let’s build something<br /><span className="accent-text">people want.</span></h2><Action id="final-start-project" arrow="up">Tell us what you’re thinking</Action></Reveal><span className="cta-orbit" aria-hidden="true" /></section>;
