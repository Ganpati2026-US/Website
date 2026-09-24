import { SEO } from '../components/Layout';
import { PageHero, Action, FinalCTA } from '../components/Primitives';
import { ServicesSection } from '../components/ServicesSection';
import { Process, Principles } from '../components/EditorialSections';

export default function Services() { return <><SEO title="Services — Build your next product" /><PageHero id="services-page" eyebrow="FROM WHAT IF TO WHAT’S NEXT" lines={['Have an idea', 'of your own?']} description="The same product thinking behind our own technology is available to ambitious founders and businesses." accent><Action id="services-hero-cta" arrow="up">Let’s build yours</Action></PageHero><ServicesSection standalone /><Process /><Principles /><FinalCTA /></>; }