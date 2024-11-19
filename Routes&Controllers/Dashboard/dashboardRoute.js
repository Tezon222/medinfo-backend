const express = require('express')
const {getPatientAnalytics} = require('../Dashboard/patientDashboard')
const router = express.Router()
 
router.get("/analytics/patient", getPatientAnalytics)

module.exports = router