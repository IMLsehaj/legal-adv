const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.create({ title, content, author: req.user.id });
  res.status(201).json(post);
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('author', 'name email');
  res.json(posts);
});

// @desc    Get post by id
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  if (post) res.json(post);
  else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (author)
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  const updated = await post.save();
  res.json(updated);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (author)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await post.remove();
  res.json({ message: 'Post removed' });
});

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
