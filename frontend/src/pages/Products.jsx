import { Link, useParams } from 'react-router-dom';
import { SEO } from '../components/Layout';
import { PageHero, Eyebrow, Action, Reveal, FinalCTA } from '../components/Primitives';
import { ProductSpotlight } from '../components/bitbyte/ProductSpotlight';
import { ProductStory } from '../components/bitbyte/ProductStory';
import { products } from '../data/products';
import { ArrowUpRight, ArrowRight, UtensilsCrossed, ScanLine, Sparkles } from 'lucide-react';
import './Products.css';
import NotFound from './NotFound';

const modules = [
  { number: '01', icon: ScanLine, word: 'SCAN', copy: 'A menu, one scan away.' },
  { number: '02', icon: UtensilsCrossed, word: 'ORDER', copy: 'Less waiting. More enjoying.' },
  { number: '03', icon: Sparkles, word: 'FLOW', copy: 'A smoother experience for every table.' },
];

export default function Products() {
  return <>
    <SEO title="BitByte — Coming soon" description="BitByte Restro is coming soon. A more thoughtful digital dining experience is in the making." />
    <section className="bitbyte-launch" aria-labelledby="bitbyte-launch-title">
      <div className="bitbyte-launch-inner container">
        <div className="bitbyte-launch-meta"><span>AN APPETISER INDIA PRODUCT</span><span className="bitbyte-launch-status"><i /> COMING SOON</span></div>
        <h1 id="bitbyte-launch-title" className="bitbyte-launch-title" data-testid="products-page-heading"><span>BIT</span><span>BYTE<span className="bitbyte-launch-period">.</span></span></h1>
        <div className="bitbyte-launch-bottom"><p>Something good<br /><em>is almost on the menu.</em></p><span className="bitbyte-launch-index">RESTRO / 001<br />NAGPUR, INDIA</span></div>
        <Link className="bitbyte-gradient-link" to="/contact?interest=BitByte%20Restro" data-testid="bitbyte-early-interest">Get in touch about BitByte <ArrowUpRight size={21} /></Link>
      </div>
      <div className="bitbyte-launch-orbit bitbyte-launch-orbit-one" aria-hidden="true" /><div className="bitbyte-launch-orbit bitbyte-launch-orbit-two" aria-hidden="true" />
    </section>
    <section className="bitbyte-modules container" aria-labelledby="bitbyte-modules-title">
      <div className="bitbyte-modules-heading"><span className="small-label">A NEW WAY TO DINE IS TAKING SHAPE</span><h2 id="bitbyte-modules-title">Small moments.<br /><span>Big difference.</span></h2><p>BitByte is being built around the moments between choosing a meal and enjoying it. Here’s the idea.</p></div>
      <div className="bitbyte-module-grid">{modules.map(({ number, icon: Icon, word, copy }) => <article className="bitbyte-module" key={word}><div className="bitbyte-module-top"><span>{number} / THE IDEA</span><Icon size={24} strokeWidth={1.4} aria-hidden="true" /></div><strong aria-label={word}>{word}</strong><p>{copy}</p></article>)}</div>
      <div className="bitbyte-modules-end"><span>MADE FOR THE TABLE. BUILT FOR WHAT'S NEXT.</span><Link to="/products/bitbyte-restro">Explore the concept <ArrowRight size={18} /></Link></div>
    </section>
    <section className="bitbyte-waitlist container"><span className="small-label">COMING SOON</span><h2>Want a seat at<br /><span>the table?</span></h2><p>Curious about BitByte for your restaurant? Start a conversation with our team.</p><Link className="bitbyte-gradient-link" to="/contact?interest=BitByte%20Restro">Talk to us <ArrowUpRight size={20} /></Link></section>
  </>;
}

export const ProductDetail = () => {
  const { slug } = useParams(); const product = products.find(p => p.slug === slug);
  if (!product) return <NotFound />;
  const bitbyte = product.id === 'bitbyte-restro';
  return <div className={bitbyte ? 'bitbyte-detail' : 'generic-product-detail'} style={{ '--product-accent': product.accent }}><SEO title={product.name} description={product.description} /><PageHero id="product-detail" eyebrow={bitbyte ? "BITBYTE RESTRO · COMING SOON" : "AN APPETISER INDIA PRODUCT"} lines={bitbyte ? ['Good food deserves', 'a better experience.'] : [product.name, product.tagline]} description={product.description} accent><Action to={product.websiteUrl || `/contact?interest=${encodeURIComponent(bitbyte ? 'BitByte Restro' : 'Other')}`} id="product-detail-cta" arrow="up">{product.websiteUrl ? `Visit ${product.name}` : 'Let’s talk about ' + product.name}</Action><Action to="#product-overview" variant="ghost" id="product-detail-discover">Discover the product</Action></PageHero><div className="container" id="product-overview"><ProductSpotlight product={product} /><Reveal className="product-overview"><Eyebrow id="product-overview-label">THE IDEA BEHIND THE PRODUCT</Eyebrow><h2 className="section-heading" data-testid="product-overview-heading">{product.content.overview}</h2></Reveal></div>{bitbyte && <ProductStory product={product} />}<section className="capabilities-section container"><Eyebrow id="capabilities-label">FOCUSED ON WHAT MATTERS</Eyebrow><h2 className="section-heading" data-testid="capabilities-heading">Simple by intention.</h2><div className="capability-rows">{product.features.map((f, i) => <Reveal key={f.title} className="capability-row"><span className="small-label">0{i + 1}</span><h3 data-testid={`capability-title-${i}`}>{f.title}</h3><p data-testid={`capability-description-${i}`}>{f.description}</p><ArrowUpRight size={18} /></Reveal>)}</div>{product.screenshots.length > 0 && <div className="product-screenshots">{product.screenshots.map((shot, i) => <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" data-testid={`product-screenshot-${i}`} />)}</div>}</section><FinalCTA /></div>;
};
