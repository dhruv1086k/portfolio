const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Dhruv Pal',
    },
    role: {
      type: String,
      default: 'Full Stack Developer',
    },
    initials: {
      type: String,
      default: 'DP',
    },
    bio: [
      {
        type: String,
      },
    ],
    metrics: [
      {
        value: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    heroTagline: {
      type: String,
      default: 'I build digital products.',
    },
    heroDescription: {
      type: String,
      default: 'Full Stack Developer specializing in MERN stack and AI-powered web applications. Building things that matter.',
    },
    heroTags: [{ type: String }],
    socials: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        handle: { type: String },
      },
    ],
    email: {
      type: String,
      default: 'dhruv@example.com',
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
