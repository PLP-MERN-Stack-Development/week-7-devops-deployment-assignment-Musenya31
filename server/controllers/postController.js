const Post = require('../models/Post');
const User = require('../models/User');

// Post controller placeholder 
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }
    const posts = await Post.find(query)
      .populate('author', 'username email role')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    const total = await Post.countDocuments(query);
    res.json({
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email role');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, featuredImage, category } = req.body;
    const author = req.user.id;
    const newPost = new Post({ title, content, featuredImage, category, author });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: 'Error creating post', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }
    const { title, content, featuredImage, category } = req.body;
    post.title = title;
    post.content = content;
    post.featuredImage = featuredImage;
    post.category = category;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: 'Error updating post', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting post', error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }
    post.likes.push(req.user.id);
    await post.save();
    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Error liking post', error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }
    post.likes = post.likes.filter((userId) => userId.toString() !== req.user.id);
    await post.save();
    res.json({ message: 'Post unliked', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Error unliking post', error: err.message });
  }
}; 