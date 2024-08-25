const mongoose = require("mongoose")
const schema = mongoose.Schema

const message = new schema({
    patientSenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patients"
    },
    patientReceiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patients"
    },
    doctorSenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctors"
    },
    doctorReceiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctors"
    },
    message:{
        type: String,
        required: true,
        default: []
    }
}, {timestamp: true})

const Messages = mongoose.model("Messages", message)

module.exports = Messages