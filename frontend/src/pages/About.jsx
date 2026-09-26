import { SEO } from '../components/Layout';
import { PageHero, Eyebrow, Reveal, Action, FinalCTA } from '../components/Primitives';
import { Marquee, Principles, Process } from '../components/EditorialSections';
import { stats } from '../data/stats';
import { projects } from '../data/projects';
import { testimonials } from '../data/testimonials';

const DirectorProfile = () => <section className="director-profile container" data-testid="director-profile">
  <Reveal className="director-profile-grid">
    <div className="director-portrait">
      <img src="/assets/team/vedang-kulkarni.png" alt="Mr. Vedang Kulkarni, Managing Director and Founder" width="1254" height="1254" loading="lazy" decoding="async" />
    </div>
    <div className="director-copy">
      <Eyebrow id="director-label">MANAGING DIRECTOR &amp; FOUNDER</Eyebrow>
      <h2>Mr. Vedang Kulkarni</h2>
      <p className="director-intro"><strong>A 22-year-old entrepreneur and Apple Developer, Vedang Kulkarni builds technology with a focus on thoughtful products, strong engineering and real-world usefulness.</strong></p>
      <p>His journey into technology began with a fascination for Apple—particularly how its hardware, software and design work together. Today, as a first-generation entrepreneur, he brings that same attention to detail to building products of his own.</p>
      <details className="director-more">
        <summary><span className="more-label">Read more</span><span className="less-label">Read less</span></summary>
        <div>
          <p>Vedang’s interest in building started long before the idea of starting a company. He was fascinated by Apple products and wanted to understand what made their software and user experience feel different.</p>
          <p>During his sophomore year, that curiosity became more serious. He began developing for Apple platforms, learning the technology by actually building and shipping products. His work has since included apps such as <strong>Revu+</strong> and <strong>LedgerOne</strong>, giving him experience taking ideas from early concepts to software used in the real world.</p>
          <p>Building those products also changed the way he thought about technology. The challenge was no longer simply writing good software—it was understanding what should be built, why someone would use it, and how technology, design and business come together to create a product people value.</p>
          <p>That experience eventually led Vedang toward entrepreneurship. As a first-generation founder, he remains closely involved in product and engineering while also shaping the direction of the company.</p>
          <p>His ambition now extends beyond individual apps. Vedang wants to contribute to a stronger Apple development ecosystem in Central India while building technology in India for a global audience.</p>
          <p><strong>For him, the goal is simple: keep building, keep learning, and create products worth using.</strong></p>
        </div>
      </details>
    </div>
  </Reveal>
</section>;

export default function About() {
  const verifiedStats = stats.filter(s => s.verified); const clientWork = projects.filter(p => p.published); const quotes = testimonials.filter(t => t.approved);
  return <><SEO title="About us" /><PageHero id="about" eyebrow="A PRODUCT COMPANY. A PRODUCT PARTNER." lines={['We’re here to build', 'things worth using.']} description="Appetiser India is a product company and digital product partner bringing strategy, design and engineering together under one roof." accent /><section className="about-manifesto container"><Reveal className="manifesto-panel"><div className="manifesto-brand" aria-label="Appetiser India"><div className="manifesto-wordmark"><strong>Appetiser<span>.</span></strong><small>INDIA</small></div></div><div className="manifesto-copy"><Eyebrow id="manifesto-label">OUR REASON TO BUILD</Eyebrow><h2 className="section-heading" data-testid="manifesto-heading">Not more software.<br /><span className="accent-text">More possibility.</span></h2><p data-testid="manifesto-copy">We believe a great product starts with a genuine understanding of the people who will use it. What slows them down? What could feel simpler? What’s worth doing differently?</p><p data-testid="manifesto-copy-two">That curiosity shapes everything we do — whether we’re building our own technology or helping someone bring their idea to life.</p></div></Reveal></section><DirectorProfile /><Marquee /><section className="about-duality container"><Reveal><Eyebrow id="duality-label">TWO WAYS TO MAKE A DIFFERENCE</Eyebrow><h2 className="section-heading" data-testid="duality-heading">Builders at heart.<br />Partners by choice.</h2></Reveal><div className="duality-columns"><Reveal><span className="small-label">01 / OUR OWN PRODUCTS</span><h3 data-testid="own-products-heading">We put our thinking<br />into the world.</h3><p data-testid="own-products-copy">With products like BitByte Restro, we work on real problems ourselves. We make the decisions, learn from the experience and keep making it better.</p><Action to="/products" id="about-products-link" variant="text">Meet our products</Action></Reveal><Reveal delay={.1}><span className="small-label">02 / YOUR NEXT PRODUCT</span><h3 data-testid="partner-products-heading">Your ambition.<br />Our shared focus.</h3><p data-testid="partner-products-copy">We bring that same ownership to the work we do with founders and businesses. Not just delivering a brief, but helping shape a product that deserves to exist.</p><Action to="/services" id="about-services-link" variant="text">How we can help</Action></Reveal></div></section><Principles /><Process />{verifiedStats.length > 0 && <section className="container verified-stats">{verifiedStats.map(s => <div key={s.id} data-testid={`stat-${s.id}`}><strong>{s.value}</strong><span>{s.label}</span></div>)}</section>}{clientWork.length > 0 && <section className="container verified-work">{clientWork.map(p => <a key={p.id} href={p.url} data-testid={`project-${p.id}`} target="_blank" rel="noopener noreferrer"><img src={p.image} alt={p.name} loading="lazy" /><h3>{p.name}</h3><p>{p.description}</p></a>)}</section>}{quotes.length > 0 && <section className="container verified-quotes">{quotes.map(t => <blockquote key={t.id} data-testid={`testimonial-${t.id}`}><p>{t.quote}</p><cite>{t.name} — {t.role}</cite></blockquote>)}</section>}<FinalCTA /></>;
}
