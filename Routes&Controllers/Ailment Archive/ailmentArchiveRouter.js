import express from 'express'
const router = express.Router()
import {getAllDiseases, getOneDisease, addDisease, updateDisease, deleteDisease} from "./ailmentArchciveController.js"

// @desc    Get All Diseases
// @route   GET /diseases/allDiseases?page=${}&limit=6
// @returns Object of page, limit, total diseases and Diseases Array
// @access  Public 
router.get("/allDiseases", getAllDiseases)

// @desc    Get One Diseases
// @route   GET /diseases/oneDisease?name=${}
// @returns Object of specific Disease containing disease, symptom, description and precaution
// @access  Public
router.get("/oneDisease", getOneDisease)

/**ADMIN ACCESS ROUTES**/
// @desc    Add a New Disease
// @route   POST /diseases/addDisease
// @access  Private
router.post("/addDisease", addDisease)

// @desc    Add a New Disease
// @route   PUT /diseases/updateDisease?name=${}
// @access  Private
router.put("/updateDisease", updateDisease)

// @desc    DELETE One Disease
// @route   DELETE /diseases?name=${}
// @access  Private
router.delete("/", deleteDisease)

export default router