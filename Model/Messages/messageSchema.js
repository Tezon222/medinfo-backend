const mongoose = require("mongoose")
const schema = mongoose.Schema

const message = new schema({
   senderId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "sender"
   },
   receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "receiver"
   },
   sender:{
    type: String,
    required: true,
    enum: ["Doctor", "Patient"]
   },
   receiver:{
    type: String,
    required: true,
    enum: ["Doctor", "Patient"]
   },
    message:{
        type: String,
        required: true,
        default: []
    }
}, {timestamp: true})

const Messages = mongoose.model("Messages", message)

module.exports = Messages