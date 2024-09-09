const express = require('express')
const router = express.Router()
const { getAllPosts, getPostById, createComment, createPost } = require("./messageBoardController")


// @desc    Get all posts
// @route   GET /posts/all
// @returns all posts with their properties
// @access  Public
router.get("/all", getAllPosts)

// @desc    Get a single post
// @route   GET /posts/:postId/:userId
// @returns a single post with its properties
// @access  Public
router.get('/:postId/:userId', getPostById);

// @desc    CREATE new post
// @route   POST /posts/new/:id
// @access  Public
router.post("/new/:id", createPost)

// @desc    CREATE new comment
// @route   POST /posts/comment/:postId/:commenterId
// @access  Public
router.post("/comment/:postId/:commenterId", createComment)

module.exports = router