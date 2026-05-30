const express = require('express');
const router = express.Router();
const { getExperiences, createExperience } = require('../controllers/experience.controller');

router.get('/', getExperiences);
router.post('/', createExperience);

module.exports = router;
