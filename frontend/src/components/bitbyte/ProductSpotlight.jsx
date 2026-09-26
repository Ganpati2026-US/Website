import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, QrCode, Utensils, Check } from 'lucide-react';
import { products } from '../../data/products';
import { Action, Eyebrow, Reveal } from '../Primitives';
import { BitByteWordmark, MenuDemo } from './MenuDemo';

export const ProductSpotlight = ({ product, index = 0 }) => {
  const bitbyte = product.id === 'bitbyte-restro';
  return <Reveal className={`product-spotlight ${bitbyte ? 'bitbyte-spotlight' : 'generic-spotlight'}`} data-testid={`product-${product.slug}`} style={{ '--product-accent': product.accent }}>
    <div className="product-spotlight-top"><span data-testid={`product-index-${product.slug}`}>0{index + 1} / AN APPETISER INDIA PRODUCT</span><span className="product-status" data-testid={`product-status-${product.slug}`}><i />{product.status === 'active' ? 'LIVE PRODUCT' : 'COMING SOON'}</span></div>
    <div className="product-spotlight-grid"><div className="product-spotlight-copy">{product.logo ? <img className="product-logo" src={product.logo} alt={product.name} /> : bitbyte ? <BitByteWordmark id="spotlight-bitbyte-wordmark" /> : <span className="generic-product-name">{product.name}</span>}<span className="product-category" data-testid={`category-${product.slug}`}>{product.category}</span><h3 data-testid={`tagline-${product.slug}`}>{bitbyte ? <>Restaurant management.<br /><span>Powered by AI.</span></> : product.tagline}</h3><p data-testid={`description-${product.slug}`}>{bitbyte ? 'BitByte is an AI-powered POS platform for restaurants, cafés and hospitality businesses—bringing orders, operations and customer engagement together in one place.' : product.description}</p><Action id={`explore-${product.slug}`} to={`/products/${product.slug}`} variant="product" arrow="up">Meet {bitbyte ? 'BitByte Restro' : product.name}</Action><div className="spotlight-capabilities" data-testid={`capabilities-${product.slug}`}>{product.features.slice(0, 3).map(f => <span key={f.title}><Check size={12} />{f.title}</span>)}</div></div>
    <div className="product-spotlight-visual">{bitbyte ? <><div className="bitbyte-desktop"><div className="browser-bar"><span>BitByte Restro</span><ArrowUpRight size={11} /></div><div className="bitbyte-welcome"><BitByteWordmark id="desktop-bitbyte-wordmark" /><h4>Smart Ordering.<br /><span>Smarter Dining.</span></h4><p>Great food is just a scan away.</p><div className="welcome-qr"><QrCode size={52} strokeWidth={1.5} /><span>SCAN. ORDER. ENJOY.</span></div><div className="welcome-steps"><span><QrCode />Scan QR</span><span><Utensils />Browse menu</span><span><Check />Place order</span></div><Link to="/contact?interest=BitByte%20Restro" data-testid="spotlight-restaurant-enquiry" className="restaurant-entry">Restaurant Dashboard <ArrowUpRight size={12} /></Link></div></div><div className="spotlight-phone"><MenuDemo prefix="spotlight" compact /></div><span className="preview-caption" data-testid="spotlight-preview-label">ILLUSTRATIVE PRODUCT PREVIEW</span></> : product.heroImage ? <img src={product.heroImage} alt={`${product.name} product overview`} loading="lazy" /> : <div className="generic-product-art" aria-hidden="true"><span>{product.name.charAt(0)}</span></div>}</div></div>
  </Reveal>;
};

const customers = [
  { name: 'Cuisines Catering & Hospitality Services', location: 'India', image: '/assets/customers/cuisines.png', fit: 'contain' },
  { name: 'TGC — The Grand Cuisines', location: 'Bajaj Nagar, Nagpur', image: '/assets/customers/tgc.jpg', fit: 'cover' },
  { name: 'Delhi 6', location: 'Pratap Nagar, Nagpur', image: '/assets/customers/delhi-6.png', fit: 'cover' },
];

const CustomerCarousel = () => {
  const ref = useRef(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const timer = setInterval(() => {
      if (!document.hidden) setActive(value => (value + 1) % customers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [inView, reduced]);
  const move = direction => setActive(value => (value + direction + customers.length) % customers.length);
  return <Reveal className="customer-showcase" data-testid="customer-carousel">
    <div className="customer-showcase-head">
      <div><Eyebrow id="customers-label">OUR CUSTOMERS</Eyebrow><h2>Trusted at the tables<br />that matter.</h2></div>
      <div className="customer-controls"><button onClick={() => move(-1)} aria-label="Previous customer"><ArrowLeft /></button><span>0{active + 1} / 0{customers.length}</span><button onClick={() => move(1)} aria-label="Next customer"><ArrowRight /></button></div>
    </div>
    <div ref={ref} className="customer-viewport">
      <div className="customer-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {customers.map(customer => <article className="customer-card" key={customer.name}>
          <div className="customer-image"><img src={customer.image} alt={`${customer.name} logo`} loading="lazy" style={{ objectFit: customer.fit }} /></div>
          <div className="customer-copy"><span>BITBYTE CUSTOMER</span><h3>{customer.name}</h3><p>{customer.location}</p></div>
        </article>)}
      </div>
    </div>
  </Reveal>;
};

export const OurProducts = ({ listing = false }) => <section className={`our-products ${listing ? 'listing-products' : ''}`} id="products" data-testid="our-products"><div className="container">{!listing && <Reveal className="products-intro"><div><Eyebrow id="products-label">INTRODUCING</Eyebrow><h2 className="section-heading" data-testid="products-heading"><span className="bitbyte-purple">BitByte.</span><br />Built for hospitality.</h2></div><div className="products-intro-right"><p data-testid="products-description">Making the restaurant industry simpler to manage, easier to promote and more memorable for every guest.</p><Action to="/products" variant="text" id="view-all-products">Explore BitByte</Action></div></Reveal>}{products.filter(p => listing || p.featured).map((product, index) => <ProductSpotlight key={product.id} product={product} index={index} />)}<CustomerCarousel /></div></section>;
