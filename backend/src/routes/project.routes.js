const express = require('express');
const router = express.Router();
const { getProjects, getFeaturedProject, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/project.controller');

router.get('/', getProjects);
router.get('/featured', getFeaturedProject);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
