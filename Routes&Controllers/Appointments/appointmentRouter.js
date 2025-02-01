import express from 'express'
const router = express.Router()
import {matchDoctor, bookAppointment, getPatientsAppointments, getDoctorsAppointments, test} from "./appointmentController.js"
import ProtectedRoute from '../../middlewares/ProtectedRoute.js'

router.post("/", ProtectedRoute, matchDoctor)
router.post("/booked/:doctorId",ProtectedRoute, bookAppointment)
router.get("/session/patient", getPatientsAppointments) 
router.get("/session/doctor", getDoctorsAppointments)
router.get("/test", test)
 
export default router