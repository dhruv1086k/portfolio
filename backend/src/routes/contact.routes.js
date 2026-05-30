const express = require('express');
const router = express.Router();
const { submitContact, getContacts, getContactById, updateContactStatus } = require('../controllers/contact.controller');
const { contactValidation } = require('../validators/contact.validator');
const validateRequest = require('../middlewares/validateRequest');

router.post('/', contactValidation, validateRequest, submitContact);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.patch('/:id/status', updateContactStatus);

module.exports = router;
