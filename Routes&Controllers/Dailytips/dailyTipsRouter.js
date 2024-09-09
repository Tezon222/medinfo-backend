const express = require('express')
const router = express.Router()
const {getRandomTips, getSingleTip} = require("./dailytipsController")

// @desc    Get 6 random tips for homepage
// @route   GET /dailyTips/tips
// @returns Object of 6 tips with ImageUrl, id and title
// @access  Public
router.get("/tips", getRandomTips)

// @desc    Get single tip
// @route   GET /dailyTips/tip/:id
// @returns Object of content, lastupdated, imageurl and imagealt
// @access  Public
router.get("/tip/:id", getSingleTip)

module.exports = router