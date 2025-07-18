const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validate');

// GET /api/categories
router.get('/', categoryController.getAllCategories);
// POST /api/categories
router.post('/', validateCategory, categoryController.createCategory);

module.exports = router; 