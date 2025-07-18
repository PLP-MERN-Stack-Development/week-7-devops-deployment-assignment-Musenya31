const { body, validationResult } = require('express-validator');

// Post validation rules
const validatePost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
  (req, res, next) => {
    // Only require 'author' on POST (create)
    if (req.method === 'POST') {
      if (!req.body.author) {
        return res.status(400).json({ errors: [{ msg: 'Author is required', param: 'author' }] });
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Category validation rules
const validateCategory = [
  body('name').notEmpty().withMessage('Name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validatePost,
  validateCategory,
}; 