import express from 'express'
const router = express.Router()
import {getRandomTips, getSingleTip} from "./dailytipsController.js"

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

export default router