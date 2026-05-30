const SiteConfig = require('../models/SiteConfig');

class ConfigService {
  async get() {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({});
    }
    return config;
  }

  async update(data) {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(data);
    } else {
      Object.assign(config, data);
      await config.save();
    }
    return config;
  }
}

module.exports = new ConfigService();
