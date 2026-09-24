export type Product = {
  id: string; slug: string; name: string; category: string; tagline: string;
  description: string; accent: string; logo: string; heroImage: string;
  screenshots: { src: string; alt: string }[];
  features: { title: string; description: string }[];
  websiteUrl: string; status: 'active' | 'coming-soon'; featured: boolean;
  content: { overview: string; audience: string; cta: string };
  verificationNotes?: string[];
};

export const products: Product[] = [
  {
    id: 'bitbyte-restro', slug: 'bitbyte-restro', name: 'BitByte Restro',
    category: 'Restaurant Technology', tagline: 'Smart Ordering. Smarter Dining.',
    description: 'BitByte Restro helps restaurants simplify digital ordering and restaurant operations through a fast, intuitive experience for customers and teams.',
    accent: '#7850db', logo: '', heroImage: '', screenshots: [],
    features: [
      { title: 'Scan QR', description: 'Scan the QR code on the table to get started.' },
      { title: 'Browse menu', description: 'Explore dishes and decide what sounds good.' },
      { title: 'Place an order', description: 'Send your choices from the digital menu.' },
      { title: 'Restaurant dashboard', description: 'A dedicated login for the restaurant experience.' },
    ],
    websiteUrl: '', status: 'active', featured: true,
    content: {
      overview: 'Less waiting. More dining. A focused product connecting the people at the table with the restaurant behind the experience.',
      audience: 'Built for modern restaurants.',
      cta: 'Discover how BitByte Restro can simplify the ordering experience for your restaurant.',
    },
    // Not published as existing capabilities. Verify with the product owner first.
    verificationNotes: ['Actual product screenshots and logo pending.', 'Kitchen routing, analytics, payments, inventory, POS, reservations, CRM, staff and table management are not confirmed.'],
  },
];