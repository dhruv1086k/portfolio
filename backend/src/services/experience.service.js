const Experience = require('../models/Experience');

class ExperienceService {
  async getAll() {
    return Experience.find().sort({ order: 1 });
  }

  async create(data) {
    return Experience.create(data);
  }

  async update(id, data) {
    return Experience.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Experience.findByIdAndDelete(id);
  }
}

module.exports = new ExperienceService();
