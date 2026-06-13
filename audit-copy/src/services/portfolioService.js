import api from './api';

export const portfolioService = {
  getProjects: () => api.get('/projects'),
  getFeaturedProject: () => api.get('/projects/featured'),
  getExperience: () => api.get('/experience'),
  getSkills: () => api.get('/skills'),
  getAchievements: () => api.get('/achievements'),
  getConfig: () => api.get('/config'),
  submitContact: (data) => api.post('/contact', data),
};

export default portfolioService;
