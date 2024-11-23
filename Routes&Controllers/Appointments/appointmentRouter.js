const express = require('express')
const router = express.Router()
const {matchDoctor, declineDoctor, bookAppointment, getPatientsAppointments, getDoctorsAppointments, test} = require("./appointmentController")
const ProtectedRoute = require('../../middlewares/ProtectedRoute')

router.post("/", ProtectedRoute, matchDoctor)
router.post("/decline", ProtectedRoute, declineDoctor)
router.post("/booked/:doctorId",ProtectedRoute, bookAppointment)
router.get("/session/patient", getPatientsAppointments) 
router.get("/session/doctor", getDoctorsAppointments)
router.get("/test", test)
 
module.exports = router