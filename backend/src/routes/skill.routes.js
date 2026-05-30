const express = require('express');
const router = express.Router();
const { getSkills, createSkill } = require('../controllers/skill.controller');

router.get('/', getSkills);
router.post('/', createSkill);

module.exports = router;
