const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const experienceService = require('../services/experience.service');

const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await experienceService.getAll();
  res.status(200).json(new ApiResponse(200, experiences, 'Experiences retrieved'));
});

const createExperience = asyncHandler(async (req, res) => {
  const experience = await experienceService.create(req.body);
  res.status(201).json(new ApiResponse(201, experience, 'Experience created'));
});

module.exports = { getExperiences, createExperience };
