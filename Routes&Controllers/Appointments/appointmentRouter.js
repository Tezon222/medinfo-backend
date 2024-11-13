const express = require('express')
const router = express.Router()
const {matchDoctor, declineDoctor, bookAppointment, getPatientsAppointments, getDoctorsAppointments, test} = require("./appointmentController")

router.post("/", matchDoctor)
router.post("/decline", declineDoctor)
router.post("/booked/:doctorId", bookAppointment)
router.get("/session/patient", getPatientsAppointments) 
router.get("/session/doctor", getDoctorsAppointments)
router.get("/test", test)
 
module.exports = router