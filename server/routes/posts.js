const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePost } = require('../middleware/validate');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', postController.getAllPosts);

// Get a single post
router.get('/:id', postController.getPostById);

// Like a post
router.post('/:id/like', auth, postController.likePost);
// Unlike a post
router.post('/:id/unlike', auth, postController.unlikePost);

// Create a post
router.post('/', auth, validatePost, postController.createPost);

// Update a post
router.put('/:id', auth, validatePost, postController.updatePost);

// Delete a post
router.delete('/:id', auth, postController.deletePost);

// TODO: Add route for creating a post
// TODO: Add route for getting all posts
// TODO: Add route for getting a single post
// TODO: Add route for updating a post
// TODO: Add route for deleting a post

module.exports = router;