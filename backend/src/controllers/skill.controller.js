const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const skillService = require('../services/skill.service');

const getSkills = asyncHandler(async (req, res) => {
  const skills = await skillService.getAll();
  res.status(200).json(new ApiResponse(200, skills, 'Skills retrieved'));
});

const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.create(req.body);
  res.status(201).json(new ApiResponse(201, skill, 'Skill created'));
});

module.exports = { getSkills, createSkill };
