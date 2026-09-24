import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Toaster } from './components/ui/sonner';
import { Navigation, Footer, ScrollManager } from './components/Layout';
import Home from './pages/Home';
import Products, { ProductDetail } from './pages/Products';
import Services from './pages/Services';
import About from './pages/About';
import Careers from './pages/Careers';
import RoleDetail from './pages/RoleDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import 'lenis/dist/lenis.css';
import './App.css';

export default function App() {
  return <MotionConfig reducedMotion="user"><BrowserRouter><ScrollManager /><a className="skip-link" href="#main-content" data-testid="skip-to-content">Skip to content</a><Navigation /><main id="main-content"><Routes><Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/products/:slug" element={<ProductDetail />} /><Route path="/services" element={<Services />} /><Route path="/about" element={<About />} /><Route path="/careers" element={<Careers />} /><Route path="/careers/:id" element={<RoleDetail />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><Toaster position="bottom-right" theme="dark" richColors /></BrowserRouter></MotionConfig>;
}