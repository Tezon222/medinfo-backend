import appointmentModel from "../../Model/Appointments/appointmentModel.js"
import User from "../../Model/Users/userSchema.js"
import getTopDoctors from "./matchDoctorAlgorithm.js"
import jwt from "jsonwebtoken"
import {createZoomMeeting, deleteZoomMeeting} from "./zoomservice.js"
import {sendAppointmentMail} from "../../utils/sendEmail.js"

let probableAppointment = []

export const test = async (req, res) => {
    const allAppointments = await appointmentModel.find()
    res.json({allAppointments})
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
            // const element = array[index]
            selectedDoctors.push(doctors[randomDocsArr[index]])           
        }
        
        return res.status(201).json({selectedDoctors}) 
    }catch(err) {
        return res.status(400).json({ Error: err.message })
    }
}
 
//Later, implement a sendmail to both doctor and patient
export const bookAppointment = async (req, res) =>{ 
    const {doctorId} = req.params //collect doctor id from params

    //patientID Collection
    const token = req.cookies.accessToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    const patientId = decoded.user_id
 
   try{
    const patient = await User.findById(patientId)
    const doctor = await User.findById(doctorId)

    const zoomMeeting = await createZoomMeeting(patient.email, doctor.email, probableAppointment[5], probableAppointment[6]) 

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
        meetingUrl: zoomMeeting.join_url, 
        meetingID: zoomMeeting.id, 
        patient: patientId,
        doctor: doctorId
    })

    await appointment.save()
    
    patient.haveAppointment = true
    patient.appointments = appointment._id
   
    doctor.haveAppointment = true
    doctor.appointments = appointment._id

    await patient.save()
    await doctor.save()

    const appointmentDetails = {
        appointmentId: appointment.id,
        appointmentName: probableAppointment[5],
        dateOfAppointment: probableAppointment[6], 
        patientName: patient.lastName, 
        doctorName: doctor.lastName,
        meetingUrl: zoomMeeting.join_url,
        meetingID: zoomMeeting.id
    }

    //sendAppointmentMail(doctor.email, patient.email, probableAppointment[5],  zoomMeeting.join_url, probableAppointment[6])

    probableAppointment = []

    return res.status(201).json({message: "Success! Appointment Booked", appointmentDetails})
   }catch(err){
    return res.status(400).json({ Error: err })
   }
}

export const deleteAppointment = async (req, res) => {
    const {appointmentId, zoomId} = req.params 

    try{
        const zoomMeeting = await deleteZoomMeeting(zoomId)
        await appointmentModel.findByIdAndDelete(appointmentId)

        // Remove references in patient and user model
        await User.updateMany(
            { appointments: appointmentId },
            { $pull: { appointments: appointmentId } }
        )

        return res.status(200).json({message: "Success! Appointment Deleted", zoomStatus: zoomMeeting})
    }catch(err){
        return res.status(400).json({ Error: err })
    }
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

