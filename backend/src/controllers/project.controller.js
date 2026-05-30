const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const projectService = require('../services/project.service');

const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAll();
  res.status(200).json(new ApiResponse(200, projects, 'Projects retrieved successfully'));
});

const getFeaturedProject = asyncHandler(async (req, res) => {
  const project = await projectService.getFeatured();
  if (!project) {
    throw new ApiError(404, 'No featured project found');
  }
  res.status(200).json(new ApiResponse(200, project, 'Featured project retrieved'));
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  res.status(200).json(new ApiResponse(200, project, 'Project retrieved'));
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.create(req.body);
  res.status(201).json(new ApiResponse(201, project, 'Project created'));
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.update(req.params.id, req.body);
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json(new ApiResponse(200, project, 'Project updated'));
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectService.delete(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json(new ApiResponse(200, null, 'Project deleted'));
});

module.exports = { getProjects, getFeaturedProject, getProjectById, createProject, updateProject, deleteProject };
