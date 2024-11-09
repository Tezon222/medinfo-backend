const mongoose =  require("mongoose")
const Schema = mongoose.Schema
const appointmentSchema = new Schema({

})

const Appointment = mongoose.model("Posts", appointmentSchema)
module.exports = Appointment