import  mongoose from "mongoose"
const Schema = mongoose.Schema
const Patients = new Schema({
    googleId:{
        type: String,
    },
    picture:{
        type: String,
    },
    firstName:{
        type: String,
        required: [true, "Please enter your Firstname"]
    },
    lastName:{
        type: String,
        required: [true, "Please enter your Lastname"]
    },
    gender:{
        type: String,
        required: [true, 'Please specify gender'],
        enum: ["Male", "Female"]
    },
    email:{
        type: String,
        required: [true, "Please enter your Email"]
    },
    password:{
        type: String,
    },
    dob:{
        type: String,
    },
    country:{
        type: String,
    },
    role:{
        type: String, 
        default: "Patient"
    },
    logins: [
        {
          month: { type: String }, // e.g., '2024-11'
          count: { type: Number, default: 0 }
        }
    ],
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
    otp:{
        type: String,
    }, 
    accessToken:{
        type: String
    }
},{
    timestamps: true
})

const Patient = mongoose.model("Patients", Patients)
export default Patient 