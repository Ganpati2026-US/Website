export const site = {
  companyName: 'Appetiser India',
  tagline: 'Ideas deserve exceptional products.',
  heroLines: ['Think it.', 'We’ll build it.'],
  heroDescription: 'We bridge the gaps in business through technology, powered by a new generation of thinkers and builders.',
  contactEmail: 'appetiserindia@gmail.com',
  // Careers uses contactEmail unless a dedicated address is added here.
  careersEmail: '',
  phone: '',
  address: 'India. Building for everywhere.',
  socialLinks: [] as { label: string; url: string }[],
  // Public Spline robot demo. Replace with your own exported scene.splinecode URL.
  // Source: https://codepen.io/Johnxxx/pen/pvgyYvq
  heroSplineScene: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
  splineUrl: '',
  careersSplineUrl: '',
  careersModel: '/models/careers.glb',
  coreImage: 'https://static.prod-images.emergentagent.com/jobs/7fcdbf21-8a4f-4c69-99ac-e4178e039fa7/images/31db3c17506448c38176072e7a0bdf0683e989129551ac262753bd07a4a71314.jpeg',
  coreVideo: { mp4: '/videos/core-loop.mp4', webm: '/videos/core-loop.webm', poster: '/videos/core-poster.jpg' },
  builderImage: 'https://static.prod-images.emergentagent.com/jobs/7fcdbf21-8a4f-4c69-99ac-e4178e039fa7/images/adf27c031d2a07bf38fbaaef32186571e46c30d4ef736406e9b4696a9caf1f49.jpeg',
  // Careers hero video (autoplay, muted, loop). Leave empty to fall back to builderImage.
  builderVideo: { mp4: '/videos/builder-loop.mp4', webm: '/videos/builder-loop.webm', poster: '/videos/builder-poster.jpg' },
  seo: {
    title: 'Appetiser India — Ideas deserve exceptional products.',
    description: 'A product company and digital product partner. Explore BitByte Restro and build what’s next with Appetiser India.',
    siteUrl: '',
  },
};

export const careersMailto = (role = '[Role]') =>
  `mailto:${site.careersEmail || site.contactEmail}?subject=${encodeURIComponent(`Career Application — ${role} — [Name]`)}`;
