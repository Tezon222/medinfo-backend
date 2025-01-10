import express from 'express'
const router = express.Router()
import {matchDoctor, declineDoctor, bookAppointment, getPatientsAppointments, getDoctorsAppointments} from "./appointmentController.js"
import ProtectedRoute from '../../middlewares/ProtectedRoute.js'

router.post("/", ProtectedRoute, matchDoctor)
router.post("/decline", ProtectedRoute, declineDoctor)
router.post("/booked/:doctorId",ProtectedRoute, bookAppointment)
router.get("/session/patient", getPatientsAppointments) 
router.get("/session/doctor", getDoctorsAppointments)
 
export default router