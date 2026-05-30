require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Skill = require('./models/Skill');
const Achievement = require('./models/Achievement');
const SiteConfig = require('./models/SiteConfig');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding database...\n');

    // Clear existing data
    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Skill.deleteMany({}),
      Achievement.deleteMany({}),
      SiteConfig.deleteMany({}),
    ]);
    console.log('  ✓ Cleared existing data');

    // ── Site Config ──
    await SiteConfig.create({
      name: 'Dhruv Pal',
      role: 'Full Stack Developer',
      initials: 'DP',
      bio: [
        "I'm Dhruv Pal, a full-stack developer and BCA student obsessed with building products that feel precise, fast, and human. I work at the intersection of engineering and design — where clean code meets thoughtful UI.",
        'Currently leading the ALFA Coding Club and building at Neosankalp — pushing myself to ship things that last.',
      ],
      metrics: [
        { value: '15+', label: 'Projects' },
        { value: '50+', label: 'Mentored' },
        { value: '2+', label: 'Years' },
        { value: '100+', label: 'Club members' },
      ],
      heroTagline: 'I build digital products.',
      heroDescription: 'Full Stack Developer specializing in MERN stack and AI-powered web applications. Building things that matter.',
      heroTags: ['MERN Stack', 'React Specialist', 'AI Integration', 'BCA · Student', 'ALFA Club · President'],
      socials: [
        { platform: 'Email', url: 'mailto:dhruv@example.com', handle: 'dhruv@example.com' },
        { platform: 'GitHub', url: 'https://github.com/dhruvpal', handle: 'github.com/dhruvpal' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/dhruvpal', handle: 'linkedin.com/in/dhruvpal' },
        { platform: 'Twitter', url: 'https://twitter.com/dhruvpal_dev', handle: '@dhruvpal_dev' },
      ],
      email: 'dhruv@example.com',
      available: true,
    });
    console.log('  ✓ Site config seeded');

    // ── Projects ──
    await Project.insertMany([
      {
        title: 'Debatable — AI Debate Platform',
        description: 'An AI-powered debate platform where users engage in structured arguments on any topic. Real-time AI moderation, argument scoring, and intelligent rebuttal suggestions — making critical thinking accessible.',
        tags: ['AI', 'Full Stack', 'MERN'],
        featured: true,
        order: 1,
        link: '#',
        letter: 'D',
        category: 'Featured · AI · Full Stack · MERN',
      },
      {
        title: 'ImageZen',
        description: 'AI-powered image optimization — compression, background removal, smart crop. Zero quality loss.',
        tags: ['AI', 'SaaS', 'React'],
        featured: false,
        order: 2,
        link: '#',
      },
      {
        title: 'Barcode Scanner',
        description: 'Real-time barcode scanning and inventory management system with elegant catalogue UI.',
        tags: ['Productivity', 'React', 'Node.js'],
        featured: false,
        order: 3,
        link: '#',
      },
      {
        title: 'Alumni Network Portal',
        description: 'Full-featured alumni platform — profiles, mentorship matching, job boards, and event management.',
        tags: ['Full Stack', 'Community', 'MERN'],
        featured: false,
        order: 4,
        link: '#',
      },
    ]);
    console.log('  ✓ Projects seeded');

    // ── Experience ──
    await Experience.insertMany([
      {
        period: '2024 — Present',
        role: 'Full Stack Developer',
        company: 'Neosankalp',
        description: 'Building and maintaining production-grade MERN applications. Leading frontend architecture decisions and collaborating with cross-functional teams to ship real products.',
        order: 1,
      },
      {
        period: '2024 — Present',
        role: 'President',
        company: 'ALFA Coding Club',
        description: 'Leading a thriving community of 100+ developers. Organizing hackathons, workshops, and coding sprints to foster innovation and real-world collaboration.',
        order: 2,
      },
      {
        period: '2023 — 2024',
        role: 'MERN Stack Mentor',
        company: 'Freelance',
        description: 'Mentored 50+ students in full-stack web development covering React, Node.js, MongoDB, and modern deployment practices end-to-end.',
        order: 3,
      },
      {
        period: '2023 — Present',
        role: 'BCA Student',
        company: 'Computer Applications',
        description: 'Studying core CS fundamentals while building real-world production projects in parallel — bridging theory with practice.',
        order: 4,
      },
    ]);
    console.log('  ✓ Experience seeded');

    // ── Skills ──
    await Skill.insertMany([
      { category: '01 — Frontend', title: 'Interface Engineering', technologies: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'], variant: 'default', gridSpan: 5, order: 1 },
      { category: '02 — JavaScript Ecosystem', title: 'Modern JS / TS', technologies: ['ES6+', 'JavaScript', 'TypeScript', 'Framer Motion', 'GSAP', 'Webpack', 'Vite'], variant: 'default', gridSpan: 7, order: 2 },
      { category: '03 — Backend', title: 'Server-Side Systems', technologies: ['Node.js', 'Express.js', 'REST API', 'JWT'], variant: 'default', gridSpan: 4, order: 3 },
      { category: '04 — Database', title: 'Data Layer', technologies: ['MongoDB', 'Mongoose', 'SQL', 'Firebase'], variant: 'default', gridSpan: 4, order: 4 },
      { category: '05 — Tools', title: 'Dev Workflow', technologies: ['Git', 'Vercel', 'Figma', 'Postman'], variant: 'default', gridSpan: 4, order: 5 },
      { category: '06 — AI Integration', title: 'AI-Powered Development', technologies: ['OpenAI API', 'Gemini', 'LangChain', 'Prompt Engineering', 'LLM Integration', 'RAG Systems'], variant: 'dark', gridSpan: 8, order: 6 },
      { category: '07 — Speciality', title: 'MERN Full Stack', technologies: ['MongoDB', 'Express', 'React', 'Node.js'], variant: 'accent', gridSpan: 4, order: 7 },
    ]);
    console.log('  ✓ Skills seeded');

    // ── Achievements ──
    await Achievement.insertMany([
      { icon: '🏆', title: 'Trophy Winner', description: 'Recognized for outstanding performance in inter-college coding competitions and technical events.', order: 1 },
      { icon: '📜', title: 'Letter of Appreciation', description: 'Received LOA for exceptional contributions to academic and extracurricular technical initiatives.', order: 2 },
      { icon: '👑', title: 'Club President', description: 'Elected to lead the ALFA Coding Club — the largest tech community on campus.', order: 3 },
      { icon: '🎓', title: 'Top Performer', description: 'Consistently top of BCA program — applying theory to live, production-grade work.', order: 4 },
    ]);
    console.log('  ✓ Achievements seeded');

    console.log('\n✓ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    process.exit(1);
  }
};

seedData();
