const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: [true, 'Icon is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
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

achievementSchema.index({ order: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
