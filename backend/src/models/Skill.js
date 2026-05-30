const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    variant: {
      type: String,
      enum: ['default', 'dark', 'accent'],
      default: 'default',
    },
    gridSpan: {
      type: Number,
      default: 4,
      min: 1,
      max: 12,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
