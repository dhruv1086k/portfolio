const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const configService = require('../services/config.service');

const getConfig = asyncHandler(async (req, res) => {
  const config = await configService.get();
  res.status(200).json(new ApiResponse(200, config, 'Config retrieved'));
});

const updateConfig = asyncHandler(async (req, res) => {
  const config = await configService.update(req.body);
  res.status(200).json(new ApiResponse(200, config, 'Config updated'));
});

module.exports = { getConfig, updateConfig };
