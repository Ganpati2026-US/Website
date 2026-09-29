import { Link, useParams } from 'react-router-dom';
import { SEO } from '../components/Layout';
import { PageHero, Eyebrow, Action, Reveal, FinalCTA } from '../components/Primitives';
import { ProductSpotlight, CustomerCarousel } from '../components/bitbyte/ProductSpotlight';
import { ProductStory } from '../components/bitbyte/ProductStory';
import { products } from '../data/products';
import { ArrowUpRight } from 'lucide-react';
import BitByteMolecules from './BitByteMolecules';
import './Products.css';
import NotFound from './NotFound';

export default function Products() {
  return <>
    <SEO title="BitByte — Cooking" description="BitByte Restro is cooking. A more thoughtful digital dining experience is in the making." />
    <section className="bitbyte-launch" aria-labelledby="bitbyte-launch-title">
      <div className="bitbyte-launch-inner">
        <span className="bitbyte-launch-status"><i /> COOKING</span>
        <BitByteMolecules />
      </div>
    </section>
    <section className="bitbyte-bridge container" aria-labelledby="bitbyte-bridge-title">
      <span className="small-label">BUILT FOR THE LONG RUN</span>
      <h2 id="bitbyte-bridge-title">Software your restaurant can grow with.</h2>
      <p>We’re a team of young builders shaping BitByte around the way restaurants really work. Our ambition is to make it a product you’ll want to keep using as your needs change, with clear choices instead of confusing bundles.</p>
      <p>Want to try it? Tell us about your restaurant and we’ll get in touch when an early preview is ready.</p>
      <Link to="/contact?interest=BitByte%20Restro" className="bitbyte-bridge-link">Request an early look <ArrowUpRight size={17} /></Link>
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
