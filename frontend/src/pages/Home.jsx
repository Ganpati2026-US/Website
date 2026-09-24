import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { SEO } from '../components/Layout';
import { Action, Eyebrow, FinalCTA } from '../components/Primitives';
import { HeroScene } from '../components/HeroScene';
import { Process } from '../components/EditorialSections';
import { ServicesSection } from '../components/ServicesSection';
import { site } from '../config/site';
import './Home.css';

export default function Home() {
  const reduced = useReducedMotion();
  return <div className="home-refresh">
    <SEO />
    <section className="studio-hero container" data-testid="home-hero">
      <motion.div className="studio-hero-copy" initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
        <Eyebrow id="home-eyebrow">INDEPENDENT MINDS. SHARED AMBITION.</Eyebrow>
        <h1 data-testid="home-heading">{site.heroLines.map((line, index) => <span className={index === 1 ? 'studio-heading-line highlighted' : 'studio-heading-line'} key={line}>{line}</span>)}</h1>
        <p className="studio-description">{site.heroDescription}</p>
        <div className="studio-actions">
          <Action id="hero-start-project" arrow="up">Let’s build something</Action>
          <Action to="/products" variant="text" id="hero-explore-products">Explore our work</Action>
        </div>
      </motion.div>
      <HeroScene />
      <div className="studio-hero-bottom"><span>STRATEGY / DESIGN / ENGINEERING</span><a href="#services">Made to make a difference <ArrowDown size={14} /></a></div>
    </section>
    <ServicesSection />
    <Process />
    <FinalCTA />
  </div>;
}
