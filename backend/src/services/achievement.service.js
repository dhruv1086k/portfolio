const Achievement = require('../models/Achievement');

class AchievementService {
  async getAll() {
    return Achievement.find().sort({ order: 1 });
  }

  async create(data) {
    return Achievement.create(data);
  }

  async update(id, data) {
    return Achievement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Achievement.findByIdAndDelete(id);
  }
}

module.exports = new AchievementService();
