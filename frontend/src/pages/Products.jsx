import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SEO } from '../components/Layout';
import { PageHero, Eyebrow, Action, Reveal, FinalCTA } from '../components/Primitives';
import { ProductSpotlight, CustomerCarousel } from '../components/bitbyte/ProductSpotlight';
import { ProductStory } from '../components/bitbyte/ProductStory';
import { products } from '../data/products';
import { ArrowUpRight, ChefHat, CookingPot, UtensilsCrossed } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import BitByteMolecules from './BitByteMolecules';
import './Products.css';
import NotFound from './NotFound';

const BitByteLaunchView = () => {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => setVisible(false), reduced ? 650 : 2800);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reduced]);

  useEffect(() => {
    if (!visible) document.body.style.overflow = '';
  }, [visible]);

  const symbols = [ChefHat, CookingPot, UtensilsCrossed];
  return <AnimatePresence>{visible && <motion.div className="bitbyte-intro" role="status" aria-label="BitByte is cooking" initial={{ opacity: 1 }} exit={{ opacity: 0, y: '-5%' }} transition={{ duration: reduced ? 0.15 : 0.75, ease: [0.76, 0, 0.24, 1] }}>
    <motion.div className="bitbyte-intro-inner" initial={reduced ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>
      <div className="bitbyte-intro-symbols" aria-hidden="true">
        {symbols.map((Icon, index) => <motion.span key={index} animate={reduced ? {} : { opacity: [0.3, 1, 0.3], scale: [0.88, 1.12, 0.88], y: [0, -5, 0] }} transition={{ duration: 1.35, delay: index * 0.22, repeat: Infinity, ease: 'easeInOut' }}><Icon /></motion.span>)}
      </div>
      <span className="bitbyte-intro-name">BITBYTE</span>
      <span className="bitbyte-intro-note">THE KITCHEN IS WARMING UP</span>
    </motion.div>
  </motion.div>}</AnimatePresence>;
};

const WordReveal = ({ children, as = 'p', id }) => {
  const reduced = useReducedMotion();
  const Tag = as === 'h2' ? motion.h2 : motion.p;
  const words = children.split(' ');
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.025 } },
  };
  const word = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : '105%' },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  return <Tag id={id} className="bitbyte-scroll-copy" aria-label={children} variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }}>
    {words.map((item, index) => <span className="bitbyte-reveal-word" aria-hidden="true" key={`${item}-${index}`}><motion.span variants={word}>{item}</motion.span>{index < words.length - 1 ? '\u00a0' : ''}</span>)}
  </Tag>;
};

export default function Products() {
  return <>
    <SEO title="BitByte — Cooking" description="BitByte Restro is cooking. A more thoughtful digital dining experience is in the making." />
    <BitByteLaunchView />
    <section className="bitbyte-launch" aria-labelledby="bitbyte-launch-title">
      <div className="bitbyte-launch-inner">
        <span className="bitbyte-launch-status"><i /> COOKING</span>
        <BitByteMolecules />
      </div>
    </section>
    <section className="bitbyte-bridge container" aria-labelledby="bitbyte-bridge-title">
      <div className="bitbyte-bridge-content">
        <Reveal><span className="small-label">BUILT FOR THE LONG RUN</span></Reveal>
        <WordReveal as="h2" id="bitbyte-bridge-title">Software your restaurant can grow with.</WordReveal>
        <WordReveal>We’re a team of young builders shaping BitByte around the way restaurants really work. Our ambition is to make it a product you’ll want to keep using as your needs change, with clear choices instead of confusing bundles.</WordReveal>
        <WordReveal>Want to try it? Tell us about your restaurant and we’ll get in touch when an early preview is ready.</WordReveal>
        <Reveal delay={0.12}><Link to="/contact?interest=BitByte%20Restro" className="bitbyte-bridge-link">Request an early look <ArrowUpRight size={17} /></Link></Reveal>
      </div>
    </section>
    <section className="bitbyte-waitlist-carousel container" aria-label="BitByte waitlist"><CustomerCarousel waitlist /></section>
  </>;
}

export const ProductDetail = () => {
  const { slug } = useParams(); const product = products.find(p => p.slug === slug);
  if (!product) return <NotFound />;
  const bitbyte = product.id === 'bitbyte-restro';
  return <div className={bitbyte ? 'bitbyte-detail' : 'generic-product-detail'} style={{ '--product-accent': product.accent }}><SEO title={product.name} description={product.description} /><PageHero id="product-detail" eyebrow={bitbyte ? "BITBYTE RESTRO · COOKING" : "AN APPETISER INDIA PRODUCT"} lines={bitbyte ? ['Good food deserves', 'a better experience.'] : [product.name, product.tagline]} description={product.description} accent><Action to={product.websiteUrl || `/contact?interest=${encodeURIComponent(bitbyte ? 'BitByte Restro' : 'Other')}`} id="product-detail-cta" arrow="up">{product.websiteUrl ? `Visit ${product.name}` : 'Let’s talk about ' + product.name}</Action><Action to="#product-overview" variant="ghost" id="product-detail-discover">Discover the product</Action></PageHero><div className="container" id="product-overview"><ProductSpotlight product={product} /><Reveal className="product-overview"><Eyebrow id="product-overview-label">THE IDEA BEHIND THE PRODUCT</Eyebrow><h2 className="section-heading" data-testid="product-overview-heading">{product.content.overview}</h2></Reveal></div>{bitbyte && <ProductStory product={product} />}<section className="capabilities-section container"><Eyebrow id="capabilities-label">FOCUSED ON WHAT MATTERS</Eyebrow><h2 className="section-heading" data-testid="capabilities-heading">Simple by intention.</h2><div className="capability-rows">{product.features.map((f, i) => <Reveal key={f.title} className="capability-row"><span className="small-label">0{i + 1}</span><h3 data-testid={`capability-title-${i}`}>{f.title}</h3><p data-testid={`capability-description-${i}`}>{f.description}</p><ArrowUpRight size={18} /></Reveal>)}</div>{product.screenshots.length > 0 && <div className="product-screenshots">{product.screenshots.map((shot, i) => <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" data-testid={`product-screenshot-${i}`} />)}</div>}</section><FinalCTA /></div>;
};
