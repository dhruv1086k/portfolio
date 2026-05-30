const Contact = require('../models/Contact');

class ContactService {
  async create(data) {
    const contact = await Contact.create(data);
    return contact;
  }

  async getAll(query = {}) {
    const { status, page = 1, limit = 20 } = query;
    const filter = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    return { contacts, total, page: parseInt(page), pages: Math.ceil(total / limit) };
  }

  async getById(id) {
    return Contact.findById(id);
  }

  async updateStatus(id, status) {
    return Contact.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }
}

module.exports = new ContactService();
