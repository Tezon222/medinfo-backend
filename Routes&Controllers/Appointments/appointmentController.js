import appointmentModel from "../../Model/Appointments/appointmentModel.js"
import doctorModel from "../../Model/Users/doctorSchema.js"
import patientModel from "../../Model/Users/patientSchema.js"
import { pipeline } from "@xenova/transformers"
import jwt from "jsonwebtoken"

let probableAppointment = []

const createPatientVector = async (reason) => {
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
    )    

    const response = await extractor( 
        [reason],
        { pooling: "mean", normalize: true }
    )  

    console.log(response, "BREAK", response.data, "BREAK", Array.from(response.data))
}

export const matchDoctor = async (req, res) =>{
    const { name, email, dob, gender, phoneNumber, reason, dateOfAppointment, medicalConditions, allergies, healthInsurance } = req.body

    try{
        if(!name || !email || !dob || !gender || !phoneNumber || !reason || !dateOfAppointment || !healthInsurance){
            res.status(400).json({message: "Please fill all fields"})  
        } 
        
        probableAppointment.push(name, email, dob, gender, phoneNumber, reason, dateOfAppointment, medicalConditions, allergies, healthInsurance)
        createPatientVector(reason)

        const randomDoc =  await doctorModel.aggregate([{ $sample: { size: 1 } }])
        res.status(201).json(randomDoc)
    }catch(err){
        res.status(400).json({ Error: err.message })
    }
}

export const declineDoctor = (req, res) => {
    probableAppointment = []
    res.status(200).redirect("/bookAppointment")
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
    const patient = await patientModel.findById(patientId)
    const doctor = await doctorModel.findById(doctorId)

    patient.haveAppointment = true
    patient.appointments = appointment._id
   
    doctor.haveAppointment = true
    doctor.appointments = appointment._id

    await patient.save()
    await doctor.save()

    probableAppointment = []
 
    res.status(201).json({message: "Appointment successfully booked", appointment})
}

export const getPatientsAppointments = async (req, res)=>{
    //patientID Collection
    const token = req.cookies.accessToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    const patientId = decoded.user_id

    const patient = await patientModel.findById(patientId).populate("appointments")

    res.status(200).json(patient)
}

export const getDoctorsAppointments = async (req, res)=>{
    //patientID Collection
    const token = req.cookies.accessToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    const doctorId = decoded.user_id

    const doctor = await doctorModel.findById(doctorId).populate("appointments")

    res.status(200).json(doctor)
}


//make sure to clear db
//     const test = async (req, res) => {

// }

// const matchDoctor = async (req, res) => {
// const appointment = await appointmentModel.findById("672fd3fb49bd9c979f5dee70").populate("patient").populate("doctor")
// res.send(appointment.patient.firstName)}

