import express from 'express'
const router = express.Router()
import {matchDoctor, bookAppointment, getPatientsAppointments, getDoctorsAppointments, deleteAppointment, test} from "./appointmentController.js"
import ProtectedRoute from '../../middlewares/ProtectedRoute.js'

router.post("/match-doctors", ProtectedRoute, matchDoctor)
router.post("/:doctorId", ProtectedRoute, bookAppointment)
router.get("/session/patient", getPatientsAppointments) 
router.get("/session/doctor", getDoctorsAppointments)
router.delete("/:appointmentId/:zoomId", ProtectedRoute, deleteAppointment)
router.get("/test", test)
  
export default router