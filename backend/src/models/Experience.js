const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: [true, 'Period is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
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

experienceSchema.index({ order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
