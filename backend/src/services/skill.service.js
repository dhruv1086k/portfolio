const Skill = require('../models/Skill');

class SkillService {
  async getAll() {
    return Skill.find().sort({ order: 1 });
  }

  async create(data) {
    return Skill.create(data);
  }

  async update(id, data) {
    return Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Skill.findByIdAndDelete(id);
  }
}

module.exports = new SkillService();
