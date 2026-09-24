import { SEO } from '../components/Layout';
import { PageHero, Eyebrow, Reveal, Action, FinalCTA } from '../components/Primitives';
import { Marquee, Principles, Process } from '../components/EditorialSections';
import { stats } from '../data/stats';
import { projects } from '../data/projects';
import { testimonials } from '../data/testimonials';

const DirectorProfile = () => <section className="director-profile container" data-testid="director-profile">
  <Reveal className="director-profile-grid">
    <div className="director-portrait" role="img" aria-label="Portrait placeholder for Vedang Kulkarni">
      <span>VK</span><small>PORTRAIT</small>
    </div>
    <div className="director-copy">
      <Eyebrow id="director-label">MANAGING DIRECTOR &amp; FOUNDER</Eyebrow>
      <h2>Mr. Vedang Kulkarni</h2>
      <p className="director-intro">A 22-year-old entrepreneur and technologist, Vedang Kulkarni represents a new generation of founders building at the intersection of technology, creativity and business.</p>
      <p>As an Apple Developer, his interests span software engineering, product development and emerging technologies. A first-generation entrepreneur, Vedang brings a hands-on approach to building—taking ideas from early concepts to products designed for real-world use.</p>
      <details className="director-more">
        <summary><span className="more-label">Read more</span><span className="less-label">Read less</span></summary>
        <div>
          <p>Vedang’s entrepreneurial journey began with a simple fascination: understanding how technology works and how it can be used to create something genuinely useful. What started as curiosity gradually evolved into an ambition to build products, solve problems and ultimately create a technology company of his own.</p>
          <p>His approach to entrepreneurship is rooted in experimentation. He believes in learning by building—developing, testing, refining and continuously challenging what a product can become. His technical background allows him to remain closely involved with the engineering and product decisions behind the company while simultaneously shaping its broader business direction.</p>
          <p>Looking ahead, Vedang’s ambition is to build technology from India for a global audience. His vision is not limited to growing a single company, but to create products with lasting relevance, explore emerging technologies and contribute to a new generation of globally ambitious technology businesses.</p>
        </div>
      </details>
    </div>
  </Reveal>
</section>;

export default function About() {
  const verifiedStats = stats.filter(s => s.verified); const clientWork = projects.filter(p => p.published); const quotes = testimonials.filter(t => t.approved);
  return <><SEO title="About us" /><PageHero id="about" eyebrow="A PRODUCT COMPANY. A PRODUCT PARTNER." lines={['We’re here to build', 'things worth using.']} description="Appetiser India is a product company and digital product partner bringing strategy, design and engineering together under one roof." accent /><section className="about-manifesto container"><Reveal className="manifesto-panel"><div className="manifesto-brand" aria-label="Appetiser India"><div className="manifesto-wordmark"><strong>Appetiser<span>.</span></strong><small>INDIA</small></div></div><div className="manifesto-copy"><Eyebrow id="manifesto-label">OUR REASON TO BUILD</Eyebrow><h2 className="section-heading" data-testid="manifesto-heading">Not more software.<br /><span className="accent-text">More possibility.</span></h2><p data-testid="manifesto-copy">We believe a great product starts with a genuine understanding of the people who will use it. What slows them down? What could feel simpler? What’s worth doing differently?</p><p data-testid="manifesto-copy-two">That curiosity shapes everything we do — whether we’re building our own technology or helping someone bring their idea to life.</p></div></Reveal></section><DirectorProfile /><Marquee /><section className="about-duality container"><Reveal><Eyebrow id="duality-label">TWO WAYS TO MAKE A DIFFERENCE</Eyebrow><h2 className="section-heading" data-testid="duality-heading">Builders at heart.<br />Partners by choice.</h2></Reveal><div className="duality-columns"><Reveal><span className="small-label">01 / OUR OWN PRODUCTS</span><h3 data-testid="own-products-heading">We put our thinking<br />into the world.</h3><p data-testid="own-products-copy">With products like BitByte Restro, we work on real problems ourselves. We make the decisions, learn from the experience and keep making it better.</p><Action to="/products" id="about-products-link" variant="text">Meet our products</Action></Reveal><Reveal delay={.1}><span className="small-label">02 / YOUR NEXT PRODUCT</span><h3 data-testid="partner-products-heading">Your ambition.<br />Our shared focus.</h3><p data-testid="partner-products-copy">We bring that same ownership to the work we do with founders and businesses. Not just delivering a brief, but helping shape a product that deserves to exist.</p><Action to="/services" id="about-services-link" variant="text">How we can help</Action></Reveal></div></section><Principles /><Process />{verifiedStats.length > 0 && <section className="container verified-stats">{verifiedStats.map(s => <div key={s.id} data-testid={`stat-${s.id}`}><strong>{s.value}</strong><span>{s.label}</span></div>)}</section>}{clientWork.length > 0 && <section className="container verified-work">{clientWork.map(p => <a key={p.id} href={p.url} data-testid={`project-${p.id}`} target="_blank" rel="noopener noreferrer"><img src={p.image} alt={p.name} loading="lazy" /><h3>{p.name}</h3><p>{p.description}</p></a>)}</section>}{quotes.length > 0 && <section className="container verified-quotes">{quotes.map(t => <blockquote key={t.id} data-testid={`testimonial-${t.id}`}><p>{t.quote}</p><cite>{t.name} — {t.role}</cite></blockquote>)}</section>}<FinalCTA /></>;
}
