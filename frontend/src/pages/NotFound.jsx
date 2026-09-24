import { PageHero, Action } from '../components/Primitives';
import { SEO } from '../components/Layout';

export default function NotFound() { return <div className="not-found"><SEO title="Page not found" /><PageHero id="not-found" eyebrow="404 / A SMALL DETOUR" lines={['This idea hasn’t', 'taken shape here.']} description="The page you’re looking for doesn’t exist. Let’s get you back to something worth exploring." accent><Action to="/" id="not-found-home">Back to home</Action><Action to="/products" variant="ghost" id="not-found-products">Explore products</Action></PageHero></div>; }