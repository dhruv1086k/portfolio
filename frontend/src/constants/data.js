// Static data fallback — used when backend is unavailable
// All data extracted from the original index.html prototype

export const SITE_CONFIG = {
  name: 'Dhruv Pal',
  role: 'Full Stack Developer',
  initials: 'DP',
  bio: [
    "I'm <strong>Dhruv Pal</strong>, a full-stack developer and BCA student obsessed with building products that feel precise, fast, and human. I work at the intersection of engineering and design — where clean code meets thoughtful UI.",
    'Currently leading the <strong>ALFA Coding Club</strong> and building at <strong>Neosankalp</strong> — pushing myself to ship things that last.',
  ],
  metrics: [
    { value: '15+', label: 'Projects' },
    { value: '50+', label: 'Mentored' },
    { value: '2+', label: 'Years' },
    { value: '100+', label: 'Club members' },
  ],
  heroTagline: 'I build digital products.',
  heroDescription:
    'Full Stack Developer specializing in MERN stack and AI-powered web applications. Building things that matter.',
  heroTags: [
    'MERN Stack',
    'React Specialist',
    'AI Integration'
  ],
  socials: [
    { platform: 'Email', url: 'mailto:dhruv@example.com', handle: 'dhruv@example.com' },
    { platform: 'GitHub', url: 'https://github.com/dhruvpal', handle: 'github.com/dhruvpal' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/dhruvpal', handle: 'linkedin.com/in/dhruvpal' },
    { platform: 'Twitter', url: 'https://twitter.com/dhruvpal_dev', handle: '@dhruvpal_dev' },
  ],
  email: 'dhruv@example.com',
};

export const SPECIALTIES = [
  { title: 'Full Stack', sub: 'MERN Developer' },
  { title: 'React', sub: 'UI Specialist' },
  { title: 'AI Integration', sub: 'LLM-Powered Apps' },
  { title: 'Club President', sub: 'ALFA Coding Club' },
];

export const TIMELINE = [
  { year: '2024–Now', title: 'Full Stack Developer — Neosankalp', sub: 'Building production-grade MERN applications' },
  { year: '2024–Now', title: 'President — ALFA Coding Club', sub: 'Leading 100+ members, organizing tech events' },
  { year: '2023–Now', title: 'BCA — Computer Applications', sub: 'CS fundamentals + real-world project building' },
  { year: '2023', title: 'MERN Mentor — Freelance', sub: 'Taught 50+ students React, Node.js, MongoDB' },
];

export const PROJECTS = [
  {
    title: 'Debatable — AI Debate Platform',
    description:
      'An AI-powered debate platform where users engage in structured arguments on any topic. Real-time AI moderation, argument scoring, and intelligent rebuttal suggestions — making critical thinking accessible.',
    tags: ['AI', 'Full Stack', 'MERN'],
    featured: true,
    link: '#',
    letter: 'D',
    category: 'Featured · AI · Full Stack · MERN',
  },
  {
    title: 'ImageZen',
    description:
      'AI-powered image optimization — compression, background removal, smart crop. Zero quality loss.',
    tags: ['AI', 'SaaS', 'React'],
    featured: false,
    link: '#',
    num: '02',
  },
  {
    title: 'Barcode Scanner',
    description:
      'Real-time barcode scanning and inventory management system with elegant catalogue UI.',
    tags: ['Productivity', 'React', 'Node.js'],
    featured: false,
    link: '#',
    num: '03',
  },
  {
    title: 'Alumni Network Portal',
    description:
      'Full-featured alumni platform — profiles, mentorship matching, job boards, and event management.',
    tags: ['Full Stack', 'Community', 'MERN'],
    featured: false,
    link: '#',
    num: '04',
  },
];

export const EXPERIENCES = [
  {
    period: '2024 — Present',
    role: 'Full Stack Developer',
    company: 'Neosankalp',
    description:
      'Building and maintaining production-grade MERN applications. Leading frontend architecture decisions and collaborating with cross-functional teams to ship real products.',
  },
  {
    period: '2024 — Present',
    role: 'President',
    company: 'ALFA Coding Club',
    description:
      'Leading a thriving community of 100+ developers. Organizing hackathons, workshops, and coding sprints to foster innovation and real-world collaboration.',
  },
  {
    period: '2023 — 2024',
    role: 'MERN Stack Mentor',
    company: 'Freelance',
    description:
      'Mentored 50+ students in full-stack web development covering React, Node.js, MongoDB, and modern deployment practices end-to-end.',
  },
  {
    period: '2023 — Present',
    role: 'BCA Student',
    company: 'Computer Applications',
    description:
      'Studying core CS fundamentals while building real-world production projects in parallel — bridging theory with practice.',
  },
];

export const SKILLS = [
  { category: '01 — Frontend', title: 'Interface Engineering', technologies: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'], variant: 'default', gridSpan: 5 },
  { category: '02 — JavaScript Ecosystem', title: 'Modern JS / TS', technologies: ['ES6+', 'JavaScript', 'TypeScript', 'Framer Motion', 'GSAP', 'Webpack', 'Vite'], variant: 'default', gridSpan: 7 },
  { category: '03 — Backend', title: 'Server-Side Systems', technologies: ['Node.js', 'Express.js', 'REST API', 'JWT'], variant: 'default', gridSpan: 4 },
  { category: '04 — Database', title: 'Data Layer', technologies: ['MongoDB', 'Mongoose', 'SQL', 'Firebase'], variant: 'default', gridSpan: 4 },
  { category: '05 — Tools', title: 'Dev Workflow', technologies: ['Git', 'Vercel', 'Figma', 'Postman'], variant: 'default', gridSpan: 4 },
  { category: '06 — AI Integration', title: 'AI-Powered Development', technologies: ['OpenAI API', 'Gemini', 'LangChain', 'Prompt Engineering', 'LLM Integration', 'RAG Systems'], variant: 'dark', gridSpan: 8 },
  { category: '07 — Speciality', title: 'MERN Full Stack', technologies: ['MongoDB', 'Express', 'React', 'Node.js'], variant: 'accent', gridSpan: 4 },
];

export const ACHIEVEMENTS = [
  { icon: '🏆', title: 'Trophy Winner', description: 'Recognized for outstanding performance in inter-college coding competitions and technical events.' },
  { icon: '📜', title: 'Letter of Appreciation', description: 'Received LOA for exceptional contributions to academic and extracurricular technical initiatives.' },
  { icon: '👑', title: 'Club President', description: 'Elected to lead the ALFA Coding Club — the largest tech community on campus.' },
  { icon: '🎓', title: 'Top Performer', description: 'Consistently top of BCA program — applying theory to live, production-grade work.' },
];

export const ROW_1 = ["React",
  "Node.js",
  "MongoDB",
  "Next.js",
  "TypeScript",
  "Tailwind",];
export const ROW_2 = ["Full Stack MERN",
  "AI Integration",
  "Design Systems",
  "Performance",];
