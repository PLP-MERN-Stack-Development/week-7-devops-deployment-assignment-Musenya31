const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// GET /api/posts/:postId/comments
router.get('/post/:postId', commentController.getCommentsByPost);
// POST /api/posts/:postId/comments
router.post('/post/:postId', commentController.createComment);

module.exports = router; 