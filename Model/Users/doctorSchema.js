import mongoose from "mongoose"
const Schema = mongoose.Schema

const Doctors = new Schema({
    firstName:{
        type: String,
        required: [true, "Please enter your Name"]
    },
    lastName:{
        type: String,
        required: [true, "Please enter your Full Name"]
    },
    picture:{
        type: String,
    },
    gender:{
        type: String, 
        enum: ["Male", "Female"]
    },
    email:{
        type: String,
        required: [true, "Please enter your Email"],
        select: false
    },
    password:{
        type: String,  
        required: [true, "Please enter your Password"],
        select: false
    },
    country:{
        type: String,
        required: [true, "Please enter your country"],
        select: false
    },
    specialty:{
        type: String,
        required: [true, "Please enter your Specialty"]
    }, 
    medicalCert:{ 
        type: String,
        required: [true, "Please provide your valid Medical Certificate"],
        select: false
    },
    role:{
        type: String,
        default: "Doctor" 
    },
    haveAppointment:{
        type: Boolean,
        default: false
    },
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointments'
        }
    ],
    accessToken:{
        type: String
    },
    chatList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients'
    }
    ]
},{
    timestamps: true,
})

const Doctor = mongoose.model("Doctors", Doctors)
export default Doctor 