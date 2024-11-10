const express = require('express')
const router = express.Router()
const {matchDoctor, declineDoctor, bookAppointment, test} = require("./appointmentController")

router.post("/", matchDoctor)
router.post("/decline", declineDoctor)
router.post("/booked/:doctorId", bookAppointment)
router.get("/test", test)
 
module.exports = router