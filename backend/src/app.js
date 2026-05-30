const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const contactRoutes = require('./routes/contact.routes');
const projectRoutes = require('./routes/project.routes');
const experienceRoutes = require('./routes/experience.routes');
const skillRoutes = require('./routes/skill.routes');
const achievementRoutes = require('./routes/achievement.routes');
const configRoutes = require('./routes/config.routes');

const app = express();

// ── Security Middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// ── Rate Limiting ──
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many contact submissions, please try again later.' },
});

app.use(generalLimiter);

// ── Logging ──
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Body Parsing ──
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// ── API Routes ──
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/config', configRoutes);

// ── 404 Handler ──
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Error Handler ──
app.use(errorHandler);

module.exports = app;
