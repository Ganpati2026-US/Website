export type Job = {
  id: string; role: string; department: 'Tech' | 'Business' | 'Creative'; location: string; type: string; isOpen: boolean;
  description: string; duration: string; commitment: string; about: string; responsibilities: string[]; learn: string[]; lookingFor: string[];
};

// Categories shown as tabs on the Careers page. Add a new department here to create a new tab.
export const departments: Job['department'][] = ['Tech', 'Business', 'Creative'];

const location = 'India · Remote-friendly';

export const jobs: Job[] = [
  {
    id: 'web-developer-intern', role: 'Web Developer Intern', department: 'Tech', location, type: 'Internship', isOpen: true,
    description: 'Build fast, accessible interfaces for our products and partner projects.',
    duration: '3–6 months', commitment: 'Full-time or part-time (min. 25 hrs/week)',
    about: 'You’ll work alongside our product and engineering team on real interfaces — from BitByte Restro to partner products — shipping work that people actually use.',
    responsibilities: ['Build responsive, accessible UI in React with attention to motion and detail.', 'Turn design files into pixel-faithful, performant components.', 'Integrate frontend features with our FastAPI backends.', 'Write clean, reviewed code and participate in weekly product reviews.'],
    learn: ['Modern React, animation and performance practices used on production sites.', 'How a product team moves from idea to shipped feature.', 'Design systems, accessibility and code review culture.', 'Working directly with founders on real business problems.'],
    lookingFor: ['Solid HTML/CSS/JavaScript and some React experience (projects count).', 'An eye for detail and typography.', 'Curiosity about how products are built end to end.'],
  },
  {
    id: 'business-analyst-intern', role: 'Business Analyst Intern', department: 'Tech', location, type: 'Internship', isOpen: true,
    description: 'Turn product questions into clear requirements, flows and decisions.',
    duration: '3–6 months', commitment: 'Full-time or part-time (min. 20 hrs/week)',
    about: 'Sit between the people who use our products and the team that builds them. You’ll help shape what gets built, why, and in what order.',
    responsibilities: ['Gather and document requirements from restaurant partners and internal teams.', 'Map user journeys and flows for BitByte Restro and partner products.', 'Prepare clear specs, acceptance criteria and release notes.', 'Track outcomes after launch and feed learnings back into the roadmap.'],
    learn: ['Product discovery, prioritisation and writing specs engineers love.', 'How restaurant technology works in the real world.', 'Stakeholder communication and structured problem-solving.', 'Tools: Notion/Figma-style documentation, basic analytics.'],
    lookingFor: ['Structured thinking and clear writing.', 'Comfort talking to customers and asking “why”.', 'Interest in product, technology and business together.'],
  },
  {
    id: 'data-analyst-intern', role: 'Data Analyst Intern', department: 'Tech', location, type: 'Internship', isOpen: true,
    description: 'Find the signal in product and business data, and make it useful.',
    duration: '3–6 months', commitment: 'Full-time or part-time (min. 20 hrs/week)',
    about: 'Help us understand how our products are used and where the business is heading — and turn that into decisions the team can act on.',
    responsibilities: ['Collect, clean and organise product, sales and marketing data.', 'Build simple dashboards and recurring reports.', 'Analyse ordering patterns and usage trends for BitByte Restro.', 'Present findings clearly to the team with recommendations.'],
    learn: ['Practical analytics with SQL/Python/Sheets on real data.', 'Defining metrics that matter for a product company.', 'Storytelling with data for non-technical audiences.', 'How analysis shapes product and business decisions.'],
    lookingFor: ['Comfort with spreadsheets and basic SQL or Python.', 'A curious, sceptical mind.', 'Care about accuracy and clarity.'],
  },
  {
    id: 'sales-intern', role: 'Sales Intern', department: 'Business', location, type: 'Internship', isOpen: true,
    description: 'Help restaurants and businesses discover what we build, and why it matters.',
    duration: '3 months (extendable)', commitment: 'Full-time or part-time (min. 20 hrs/week)',
    about: 'Be the first conversation restaurants have with BitByte Restro. You’ll help us reach the right people, understand their needs and bring them on board.',
    responsibilities: ['Research and reach out to restaurants and businesses that fit our products.', 'Run discovery calls and product walkthroughs with prospects.', 'Maintain the pipeline and follow up with care and consistency.', 'Share customer feedback with the product team.'],
    learn: ['Consultative B2B selling for a technology product.', 'Understanding customer problems before proposing solutions.', 'Pipeline management, CRM hygiene and follow-up rhythm.', 'How sales insights shape a product roadmap.'],
    lookingFor: ['Confident, warm communicator in English and a regional language.', 'Resilience and a genuine interest in people.', 'Organised and self-driven.'],
  },
  {
    id: 'social-media-intern', role: 'Social Media Management Intern', department: 'Business', location, type: 'Internship', isOpen: true,
    description: 'Shape how Appetiser and BitByte show up online, one thoughtful post at a time.',
    duration: '3 months (extendable)', commitment: 'Part-time (min. 15 hrs/week)',
    about: 'Own the voice of two brands online — Appetiser India and BitByte Restro — and grow an audience that cares about good products and good food.',
    responsibilities: ['Plan and publish a content calendar across Instagram, LinkedIn and X.', 'Write captions and coordinate visuals with the creative team.', 'Engage with the community and respond thoughtfully.', 'Track performance and suggest what to do more of.'],
    learn: ['Brand voice, content strategy and community building.', 'Running social for a B2B product and a consumer-facing product at once.', 'Reading analytics and iterating on what works.', 'Collaborating with design and product teams.'],
    lookingFor: ['Strong writing and a feel for what makes content land.', 'Familiarity with Instagram, LinkedIn and current formats.', 'Consistency and attention to detail.'],
  },
  {
    id: 'creative-editor-intern', role: 'Creative Editor Intern', department: 'Creative', location, type: 'Internship', isOpen: true,
    description: 'Cut, colour and craft videos and visuals that make our products feel alive.',
    duration: '3 months (extendable)', commitment: 'Part-time (min. 15 hrs/week)',
    about: 'From product reels for BitByte Restro to brand films for Appetiser, you’ll turn raw footage and ideas into polished, scroll-stopping work.',
    responsibilities: ['Edit short-form videos, reels and product walkthroughs.', 'Design motion graphics, thumbnails and social visuals.', 'Maintain a consistent visual language across both brands.', 'Collaborate with the social media and product teams on campaigns.'],
    learn: ['Editing and motion design for real brand campaigns.', 'Building a visual identity that works across platforms.', 'Feedback-driven creative iteration.', 'How creative work supports product and sales goals.'],
    lookingFor: ['Hands-on experience with Premiere Pro / DaVinci / After Effects or similar.', 'A portfolio or reel (student work is welcome).', 'Taste, pace and an eye for rhythm.'],
  },
];
