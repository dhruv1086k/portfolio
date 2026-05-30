const Project = require('../models/Project');

class ProjectService {
  async getAll() {
    return Project.find().sort({ order: 1 });
  }

  async getFeatured() {
    return Project.findOne({ featured: true });
  }

  async getById(id) {
    return Project.findById(id);
  }

  async create(data) {
    return Project.create(data);
  }

  async update(id, data) {
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Project.findByIdAndDelete(id);
  }
}

module.exports = new ProjectService();
