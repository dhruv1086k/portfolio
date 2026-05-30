const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const achievementService = require('../services/achievement.service');

const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await achievementService.getAll();
  res.status(200).json(new ApiResponse(200, achievements, 'Achievements retrieved'));
});

const createAchievement = asyncHandler(async (req, res) => {
  const achievement = await achievementService.create(req.body);
  res.status(201).json(new ApiResponse(201, achievement, 'Achievement created'));
});

module.exports = { getAchievements, createAchievement };
