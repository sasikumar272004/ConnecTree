// routes/postRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// @desc    Get all posts (with pagination and filtering)
// @route   GET /api/posts
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving posts'
    });
  }
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name email avatar');

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Post retrieved successfully',
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving post'
    });
  }
});

// @desc    Get posts by current user
// @route   GET /api/posts/user/my-posts
// @access  Private
router.get('/user/my-posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId: req.user.id })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ userId: req.user.id });
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      status: 'success',
      message: 'User posts retrieved successfully',
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while retrieving user posts'
    });
  }
});

// @desc    Create a new post with image upload
// @route   POST /api/posts
// @access  Private
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { content, location } = req.body;

    // Validation
    if (!content || content.trim().length === 0) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: 'error',
        message: 'Post content is required'
      });
    }

    if (content.length > 2000) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: 'error',
        message: 'Post content cannot exceed 2000 characters'
      });
    }

    const postData = {
      userId: req.user.id,
      content: content.trim(),
      location: location || null
    };

    // Add image path if file was uploaded
    if (req.file) {
      postData.image = `/uploads/images/${req.file.filename}`;
    }

    const post = new Post(postData);
    const savedPost = await post.save();
    await savedPost.populate('userId', 'name email avatar');

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: savedPost
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Create post error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating post'
    });
  }
});

// @desc    Update post with image
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { content, location, removeImage } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    if (post.userId.toString() !== req.user.id) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this post'
      });
    }

    // Validation
    if (!content || content.trim().length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: 'error',
        message: 'Post content is required'
      });
    }

    // Handle image removal if requested
    if (removeImage === 'true' && post.image) {
      const oldImagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      post.image = null;
    }

    // Delete old image if new one is uploaded
    if (req.file && post.image) {
      const oldImagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    post.content = content.trim();
    post.location = location || post.location;
    post.updatedAt = Date.now();

    // Update image if new one was uploaded
    if (req.file) {
      post.image = `/uploads/images/${req.file.filename}`;
    }

    const updatedPost = await post.save();
    await updatedPost.populate('userId', 'name email avatar');

    res.json({
      status: 'success',
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Update post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating post'
    });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this post'
      });
    }

    // Delete associated image file if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting post'
    });
  }
});

// @desc    Like/unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
      await post.save();
      
      res.json({
        status: 'success',
        message: 'Post unliked successfully',
        data: { liked: false, likesCount: post.likes.length }
      });
    } else {
      // Like the post
      post.likes.push(req.user.id);
      await post.save();
      
      res.json({
        status: 'success',
        message: 'Post liked successfully',
        data: { liked: true, likesCount: post.likes.length }
      });
    }
  } catch (error) {
    console.error('Like post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while processing like'
    });
  }
});

module.exports = router;