const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Comment controller placeholder 
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content, author } = req.body;
    const { postId } = req.params;
    const comment = new Comment({ content, author, post: postId });
    const savedComment = await comment.save();
    // Add comment to post's comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating comment', error: err.message });
  }
}; 