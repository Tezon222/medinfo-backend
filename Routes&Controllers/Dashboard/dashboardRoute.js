import express from 'express'
import {getPatientAnalytics} from '../Dashboard/patientDashboard.js'
const router = express.Router()
 
router.get("/analytics/patient", getPatientAnalytics)

export default router