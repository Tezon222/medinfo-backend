const mongoose = require("mongoose")
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
        required: [true, "Please enter your Email"]
    },
    password:{
        type: String,
        required: [true, "Please enter your Password"]
    },
    country:{
        type: String,
        required: [true, "Please enter your country"]
    },
    address:{
        type: String,
        required: [true, "Please enter your Address"]
    },
    specialty:{
        type: String,
        required: [true, "Please enter your Specialty"]
    },
    medicalCert:{
        type: String,
        required: [true, "Please provide your valid Medical Certificate"]
    },
    role:{
        type: String,
        default: "Doctor"
    },
    accessToken:{
        type: String
    }
},{
    timestamps: true
})

const Doctor = mongoose.model("Doctors", Doctors)
module.exports = Doctor 