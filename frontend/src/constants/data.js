// Static data fallback — used when backend is unavailable
// All data extracted from the original index.html prototype

export const SITE_CONFIG = {
  name: 'Dhruv Pal',
  role: 'Full Stack Developer',
  initials: 'DP',
  bio: [
    "I'm Dhruv Pal, a full-stack developer who enjoys building modern web applications. I focus on performance, user experience, and clean code. I love creating products that solve real problems, from backend systems to polished interfaces.",
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
    title: 'Code Arena — Productivity & Session Tracker',
    description:
      'A full-stack productivity platform that helps developers track coding sessions, maintain daily streaks, and organize tasks. Built with secure JWT authentication, Redis-powered performance optimization, MongoDB aggregation pipelines, and a responsive React dashboard.',
    tags: ['Productivity', 'Full Stack', 'MERN'],
    featured: true,
    link: '#',
    letter: 'C',
    category: 'Featured · Productivity · Full Stack · MERN',
  },
  {
    title: 'Neosankalp Official Website',
    description:
      'Designed and developed a modern, responsive corporate website using React, Tailwind CSS, ShadCN UI, and Radix UI. Focused on reusable components, scalable architecture, and performance optimization for a seamless user experience.',
    tags: ['React', 'UI/UX', 'Frontend'],
    featured: false,
    link: '#',
    letter: 'N',
    category: 'Frontend · React · UI Engineering',
  },
  {
    title: 'Apex Animated Website',
    description:
      'Built an immersive landing page featuring GSAP animations, Three.js powered 3D interactions, and Swiper.js transitions while maintaining responsive design and smooth performance.',
    tags: ['GSAP', 'Three.js', 'Animations'],
    featured: false,
    link: '#',
    letter: 'A',
    category: 'Creative · Animation · Frontend',
  },
  {
    title: 'Multi-Tenant SaaS',
    description:
      'A scalable SaaS backend architecture supporting multi-organization workspaces, role-based access control, secure authentication, project management, and invitation workflows.',
    tags: ['SaaS', 'Backend', 'Node.js'],
    featured: false,
    link: '#',
    letter: 'S',
    category: 'Backend · SaaS · Architecture',
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
