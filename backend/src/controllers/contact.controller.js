const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const contactService = require('../services/contact.service');

const submitContact = asyncHandler(async (req, res) => {
  const contact = await contactService.create(req.body);
  res.status(201).json(new ApiResponse(201, contact, 'Message sent successfully'));
});

const getContacts = asyncHandler(async (req, res) => {
  const result = await contactService.getAll(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Contacts retrieved successfully'));
});

const getContactById = asyncHandler(async (req, res) => {
  const contact = await contactService.getById(req.params.id);
  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }
  res.status(200).json(new ApiResponse(200, contact, 'Contact retrieved successfully'));
});

const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await contactService.updateStatus(req.params.id, req.body.status);
  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }
  res.status(200).json(new ApiResponse(200, contact, 'Contact status updated'));
});

module.exports = { submitContact, getContacts, getContactById, updateContactStatus };
