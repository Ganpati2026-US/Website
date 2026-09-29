import { Link, useParams } from 'react-router-dom';
import { SEO } from '../components/Layout';
import { PageHero, Eyebrow, Action, Reveal, FinalCTA } from '../components/Primitives';
import { ProductSpotlight } from '../components/bitbyte/ProductSpotlight';
import { ProductStory } from '../components/bitbyte/ProductStory';
import { products } from '../data/products';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import BitByteMolecules from './BitByteMolecules';
import './Products.css';
import NotFound from './NotFound';

const modules = [
  { number: '01', word: 'SCAN', copy: 'A quiet little scan at the table.' },
  { number: '02', word: 'BROWSE', copy: 'Take your time with the menu.' },
  { number: '03', word: 'ORDER', copy: 'Send the good stuff on its way.' },
];

export default function Products() {
  return <>
    <SEO title="BitByte — Coming soon" description="BitByte Restro is coming soon. A more thoughtful digital dining experience is in the making." />
    <section className="bitbyte-launch" aria-labelledby="bitbyte-launch-title">
      <div className="bitbyte-launch-inner container">
        <div className="bitbyte-launch-meta"><span>AN APPETISER INDIA PRODUCT</span><span className="bitbyte-launch-status"><i /> COMING SOON</span></div>
        <BitByteMolecules />
        <div className="bitbyte-launch-bottom"><p>For the little moments<br /><em>before the first bite.</em></p><span className="bitbyte-launch-index">RESTRO / 001<br />NAGPUR, INDIA</span></div>
        <Link className="bitbyte-gradient-link" to="/contact?interest=BitByte%20Restro" data-testid="bitbyte-early-interest">Ask us about BitByte <ArrowUpRight size={21} /></Link>
      </div>
    </section>
    <section className="bitbyte-modules container" aria-labelledby="bitbyte-modules-title">
      <div className="bitbyte-modules-heading"><span className="small-label">A NEW WAY TO DINE IS TAKING SHAPE</span><h2 id="bitbyte-modules-title">The good stuff<br /><span>starts here.</span></h2><p>A small thought: ordering should feel as easy as deciding what looks delicious. BitByte is still in the making, and this is where we’re starting.</p></div>
      <div className="bitbyte-module-grid">{modules.map(({ number, word, copy }) => <article className="bitbyte-module" key={word}><div className="bitbyte-module-top"><span>{number} / THE IDEA</span><span className="bitbyte-module-mark" aria-hidden="true">✳</span></div><strong aria-label={word}>{word}</strong><p>{copy}</p></article>)}</div>
      <div className="bitbyte-modules-end"><span>A LITTLE PREVIEW OF WHAT COULD BE.</span><Link to="/products/bitbyte-restro">Explore the concept <ArrowRight size={18} /></Link></div>
    </section>
    <section className="bitbyte-waitlist container"><span className="small-label">COMING SOON</span><h2>Save a seat<br /><span>at the table.</span></h2><p>Curious about BitByte for your restaurant? Start a conversation with our team.</p><Link className="bitbyte-gradient-link" to="/contact?interest=BitByte%20Restro">Talk to us <ArrowUpRight size={20} /></Link></section>
  </>;
}

export const ProductDetail = () => {
  const { slug } = useParams(); const product = products.find(p => p.slug === slug);
  if (!product) return <NotFound />;
  const bitbyte = product.id === 'bitbyte-restro';
  return <div className={bitbyte ? 'bitbyte-detail' : 'generic-product-detail'} style={{ '--product-accent': product.accent }}><SEO title={product.name} description={product.description} /><PageHero id="product-detail" eyebrow={bitbyte ? "BITBYTE RESTRO · COMING SOON" : "AN APPETISER INDIA PRODUCT"} lines={bitbyte ? ['Good food deserves', 'a better experience.'] : [product.name, product.tagline]} description={product.description} accent><Action to={product.websiteUrl || `/contact?interest=${encodeURIComponent(bitbyte ? 'BitByte Restro' : 'Other')}`} id="product-detail-cta" arrow="up">{product.websiteUrl ? `Visit ${product.name}` : 'Let’s talk about ' + product.name}</Action><Action to="#product-overview" variant="ghost" id="product-detail-discover">Discover the product</Action></PageHero><div className="container" id="product-overview"><ProductSpotlight product={product} /><Reveal className="product-overview"><Eyebrow id="product-overview-label">THE IDEA BEHIND THE PRODUCT</Eyebrow><h2 className="section-heading" data-testid="product-overview-heading">{product.content.overview}</h2></Reveal></div>{bitbyte && <ProductStory product={product} />}<section className="capabilities-section container"><Eyebrow id="capabilities-label">FOCUSED ON WHAT MATTERS</Eyebrow><h2 className="section-heading" data-testid="capabilities-heading">Simple by intention.</h2><div className="capability-rows">{product.features.map((f, i) => <Reveal key={f.title} className="capability-row"><span className="small-label">0{i + 1}</span><h3 data-testid={`capability-title-${i}`}>{f.title}</h3><p data-testid={`capability-description-${i}`}>{f.description}</p><ArrowUpRight size={18} /></Reveal>)}</div>{product.screenshots.length > 0 && <div className="product-screenshots">{product.screenshots.map((shot, i) => <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" data-testid={`product-screenshot-${i}`} />)}</div>}</section><FinalCTA /></div>;
};
