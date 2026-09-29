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
    <SEO title="BitByte — Coming soon" description="BitByte Restro is coming soon. A more thoughtful digital dining experience is in the making." />
    <section className="bitbyte-launch" aria-labelledby="bitbyte-launch-title">
      <div className="bitbyte-launch-inner">
        <span className="bitbyte-launch-status"><i /> COMING SOON</span>
        <BitByteMolecules />
        <Link className="bitbyte-gradient-link" to="/contact?interest=BitByte%20Restro" data-testid="bitbyte-early-interest">Ask us about BitByte <ArrowUpRight size={21} /></Link>
      </div>
    </section>
    <section className="bitbyte-waitlist-carousel container" aria-label="BitByte waitlist"><CustomerCarousel waitlist /></section>
  </>;
}

export const ProductDetail = () => {
  const { slug } = useParams(); const product = products.find(p => p.slug === slug);
  if (!product) return <NotFound />;
  const bitbyte = product.id === 'bitbyte-restro';
  return <div className={bitbyte ? 'bitbyte-detail' : 'generic-product-detail'} style={{ '--product-accent': product.accent }}><SEO title={product.name} description={product.description} /><PageHero id="product-detail" eyebrow={bitbyte ? "BITBYTE RESTRO · COMING SOON" : "AN APPETISER INDIA PRODUCT"} lines={bitbyte ? ['Good food deserves', 'a better experience.'] : [product.name, product.tagline]} description={product.description} accent><Action to={product.websiteUrl || `/contact?interest=${encodeURIComponent(bitbyte ? 'BitByte Restro' : 'Other')}`} id="product-detail-cta" arrow="up">{product.websiteUrl ? `Visit ${product.name}` : 'Let’s talk about ' + product.name}</Action><Action to="#product-overview" variant="ghost" id="product-detail-discover">Discover the product</Action></PageHero><div className="container" id="product-overview"><ProductSpotlight product={product} /><Reveal className="product-overview"><Eyebrow id="product-overview-label">THE IDEA BEHIND THE PRODUCT</Eyebrow><h2 className="section-heading" data-testid="product-overview-heading">{product.content.overview}</h2></Reveal></div>{bitbyte && <ProductStory product={product} />}<section className="capabilities-section container"><Eyebrow id="capabilities-label">FOCUSED ON WHAT MATTERS</Eyebrow><h2 className="section-heading" data-testid="capabilities-heading">Simple by intention.</h2><div className="capability-rows">{product.features.map((f, i) => <Reveal key={f.title} className="capability-row"><span className="small-label">0{i + 1}</span><h3 data-testid={`capability-title-${i}`}>{f.title}</h3><p data-testid={`capability-description-${i}`}>{f.description}</p><ArrowUpRight size={18} /></Reveal>)}</div>{product.screenshots.length > 0 && <div className="product-screenshots">{product.screenshots.map((shot, i) => <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" data-testid={`product-screenshot-${i}`} />)}</div>}</section><FinalCTA /></div>;
};
