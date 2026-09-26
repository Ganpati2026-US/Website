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
      <p className="director-intro">Mr. Vedang Kulkarni is a first generation entrepreneur and technologist with a strong interest in building products for the Apple ecosystem. His interest in technology began with a fascination for Apple and a curiosity about what made its products feel different. He was particularly drawn to the way software, design and technology came together to create simple and thoughtful experiences.</p>
      <details className="director-more">
        <summary><span className="more-label">Read more</span><span className="less-label">Read less</span></summary>
        <div>
          <p>During his sophomore year, Vedang began developing for Apple platforms and started turning that curiosity into real products. His journey has included building and shipping applications such as <strong>Revu+</strong> and <strong>LedgerOne</strong>, giving him early experience in taking an idea from concept and development to something people could actually use.</p>
          <p>As Founder and Managing Director, Vedang remains closely involved in the technology and product decisions behind the company while also shaping its broader direction. He prefers learning by building, testing ideas in the real world and improving them through experience.</p>
          <p>Looking ahead, Vedang wants to build technology in India for a global audience and contribute to the growing Apple developer community in Central India. His ambition is simple: to keep building useful products, explore new ideas and grow a technology company that can create meaningful work for years to come.</p>
        </div>
      </details>
    </div>
  </Reveal>
</section>;

export default function About() {
  const verifiedStats = stats.filter(s => s.verified); const clientWork = projects.filter(p => p.published); const quotes = testimonials.filter(t => t.approved);
  return <><SEO title="About us" /><PageHero id="about" eyebrow="A PRODUCT COMPANY. A PRODUCT PARTNER." lines={['We’re here to build', 'things worth using.']} description="Appetiser India is a product company and digital product partner bringing strategy, design and engineering together under one roof." accent /><section className="about-manifesto container"><Reveal className="manifesto-panel"><div className="manifesto-brand" aria-label="Appetiser India"><div className="manifesto-wordmark"><strong>Appetiser<span>.</span></strong><small>INDIA</small></div></div><div className="manifesto-copy"><Eyebrow id="manifesto-label">OUR REASON TO BUILD</Eyebrow><h2 className="section-heading" data-testid="manifesto-heading">Not more software.<br /><span className="accent-text">More possibility.</span></h2><p data-testid="manifesto-copy">We believe a great product starts with a genuine understanding of the people who will use it. What slows them down? What could feel simpler? What’s worth doing differently?</p><p data-testid="manifesto-copy-two">That curiosity shapes everything we do — whether we’re building our own technology or helping someone bring their idea to life.</p></div></Reveal></section><DirectorProfile /><Marquee /><section className="about-duality container"><Reveal><Eyebrow id="duality-label">TWO WAYS TO MAKE A DIFFERENCE</Eyebrow><h2 className="section-heading" data-testid="duality-heading">Builders at heart.<br />Partners by choice.</h2></Reveal><div className="duality-columns"><Reveal><span className="small-label">01 / OUR OWN PRODUCTS</span><h3 data-testid="own-products-heading">We put our thinking<br />into the world.</h3><p data-testid="own-products-copy">With products like BitByte Restro, we work on real problems ourselves. We make the decisions, learn from the experience and keep making it better.</p><Action to="/products" id="about-products-link" variant="text">Meet our products</Action></Reveal><Reveal delay={.1}><span className="small-label">02 / YOUR NEXT PRODUCT</span><h3 data-testid="partner-products-heading">Your ambition.<br />Our shared focus.</h3><p data-testid="partner-products-copy">We bring that same ownership to the work we do with founders and businesses. Not just delivering a brief, but helping shape a product that deserves to exist.</p><Action to="/services" id="about-services-link" variant="text">How we can help</Action></Reveal></div></section><Principles /><Process />{verifiedStats.length > 0 && <section className="container verified-stats">{verifiedStats.map(s => <div key={s.id} data-testid={`stat-${s.id}`}><strong>{s.value}</strong><span>{s.label}</span></div>)}</section>}{clientWork.length > 0 && <section className="container verified-work">{clientWork.map(p => <a key={p.id} href={p.url} data-testid={`project-${p.id}`} target="_blank" rel="noopener noreferrer"><img src={p.image} alt={p.name} loading="lazy" /><h3>{p.name}</h3><p>{p.description}</p></a>)}</section>}{quotes.length > 0 && <section className="container verified-quotes">{quotes.map(t => <blockquote key={t.id} data-testid={`testimonial-${t.id}`}><p>{t.quote}</p><cite>{t.name} — {t.role}</cite></blockquote>)}</section>}<FinalCTA /></>;
}
