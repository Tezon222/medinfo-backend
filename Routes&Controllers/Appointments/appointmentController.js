import appointmentModel from "../../Model/Appointments/appointmentModel.js"
import User from "../../Model/Users/userSchema.js"
import { pipeline } from "@xenova/transformers"
import getTopDoctors from "./matchDoctorAlgorithm.js"
import jwt from "jsonwebtoken"

let probableAppointment = []

export const test = async (req, res) => {
    console.log("this is a test")
} 

export const matchDoctor = async (req, res) =>{
    const { name, email, dob, gender, phoneNumber, reason, dateOfAppointment, medicalConditions, allergies, healthInsurance } = req.body

    try{
        if(!name || !email || !dob || !gender || !phoneNumber || !reason || !dateOfAppointment || !healthInsurance){
            return res.status(400).json({message: "Please fill all fields"})  
        } 
        
        probableAppointment.push(name, email, dob, gender, phoneNumber, reason, dateOfAppointment, medicalConditions, allergies, healthInsurance)
        
        const randomDocsArr = await getTopDoctors(reason)
        const doctors = await User.find({role: "Doctor"})

        let selectedDoctors = []
        
        for (let index = 0; index < randomDocsArr.length; index++) {
            // const element = array[index];
            selectedDoctors.push(doctors[randomDocsArr[index]])           
        }

        return res.status(201).json({selectedDoctors}) 
    }catch(err) {
       return res.status(400).json({ Error: err.message })
    }
}
 
export const bookAppointment = async (req, res) =>{ 
    const {doctorId} = req.params //collect doctor id from params

    //patientID Collection
    const token = req.cookies.accessToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    const patientId = decoded.user_id
 
    const appointment = new appointmentModel({
        name: probableAppointment[0],
        email: probableAppointment[1],
        dob: probableAppointment[2], 
        gender: probableAppointment[3], 
        phoneNumber: probableAppointment[4], 
        reason: probableAppointment[5], 
        dateOfAppointment: probableAppointment[6],   
        medicalConditions: probableAppointment[7], 
        allergies: probableAppointment[8], 
        healthInsurance: probableAppointment[9],
        patient: patientId,
        doctor: doctorId
    })

    await appointment.save()
    const patient = await User.findById(patientId)
    const doctor = await User.findById(doctorId)

    patient.haveAppointment = true
    patient.appointments = appointment._id
   
    doctor.haveAppointment = true
    doctor.appointments = appointment._id

    await patient.save()
    await doctor.save()

    probableAppointment = []
 
   return res.status(201).json({message: "Appointment successfully booked", appointment})
}

export const getPatientsAppointments = async (req, res)=>{
    //patientID Collection
    const token = req.cookies.accessToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    const patientId = decoded.user_id

    const patient = await User.findById(patientId).populate("appointments")

    res.status(200).json(patient)
}

export const getDoctorsAppointments = async (req, res)=>{
    //patientID Collection
    const token = req.cookies.accessToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    const doctorId = decoded.user_id

    const doctor = await User.findById(doctorId).populate("appointments")

    res.status(200).json(doctor)
}


//make sure to clear db
//     const test = async (req, res) => {
// }

// const matchDoctor = async (req, res) => {
// const appointment = await appointmentModel.findById("672fd3fb49bd9c979f5dee70").populate("patient").populate("doctor")
// res.send(appointment.patient.firstName)}

