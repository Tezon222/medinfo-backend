const express = require('express')
const router = express.Router()
const { getAllPosts, getPostById, createComment, createPost } = require("./messageBoardController")
const ProtectedRoute = require('../../middlewares/ProtectedRoute')


// @desc    Get all posts
// @route   GET /posts/all
// @returns all posts with their properties
// @access  Public
router.get("/all", ProtectedRoute ,getAllPosts)

// @desc    Get a single post
// @route   GET /posts/:postId/:userId
// @returns a single post with its properties
// @access  Public
router.get('/:postId/:userId', ProtectedRoute, getPostById);

// @desc    CREATE new post
// @route   POST /posts/new/:id
// @access  Public
router.post("/new/:id",ProtectedRoute, createPost)

// @desc    CREATE new comment
// @route   POST /posts/comment/:postId/:commenterId
// @access  Public
router.post("/comment/:postId/:commenterId",ProtectedRoute, createComment)

module.exports = router