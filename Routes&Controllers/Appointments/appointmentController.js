const appointmentModel = require("../../Model/Appointments/appointmentModel")
const doctorModel = require("../../Model/Users/doctorSchema")
const patientModel = require("../../Model/Users/patientSchema")
const jwt = require("jsonwebtoken") 

let probableAppointment = []

const matchDoctor = async (req, res) =>{
    const { name, email, dob, gender, phoneNumber, reason, dateOfAppointment, medicalConditions, allergies, healthInsurance } = req.body

    try{
        if(!name || !email || !dob || !gender || !phoneNumber || !reason || !dateOfAppointment || !healthInsurance){
            res.status(400).json({message: "Please fill all fields"})  
        } 
        
        probableAppointment.push(name, email, dob, gender, phoneNumber, reason, dateOfAppointment, medicalConditions, allergies, healthInsurance)

        const randomDoc =  await doctorModel.aggregate([{ $sample: { size: 1 } }])
        res.status(201).json(randomDoc)
    }catch(err){
        res.status(400).json({ Error: err.message })
    }
}

const declineDoctor = (req, res) => {
    probableAppointment = []
    res.status(200).redirect("/bookAppointment")
}
 
const bookAppointment = async (req, res) =>{ 
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
    doctor.haveAppointment = true

    await patient.save()
    await doctor.save()

    probableAppointment = []
 
    res.status(201).json({message: "Appointment successfully booked", appointment})
}

//make sure to clear db
    const test = async (req, res) => {

}

// const matchDoctor = async (req, res) => {
// const appointment = await appointmentModel.findById("672fd3fb49bd9c979f5dee70").populate("patient").populate("doctor")
// res.send(appointment.patient.firstName)}

module.exports = {matchDoctor, declineDoctor, bookAppointment, test}