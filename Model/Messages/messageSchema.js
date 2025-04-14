import mongoose from "mongoose"
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
        required: true
    }
}, {timestamp: true})

const Messages = mongoose.model("Messages", message)

export default Messages