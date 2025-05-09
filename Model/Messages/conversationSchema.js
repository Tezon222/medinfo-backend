import mongoose from "mongoose"
const Schema = mongoose.Schema

const conversation = new Schema({
    participants:[
        {   type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
     },
        {   type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
     }
    ],
    messageIds:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Messages'
        }
    ]
},{timestamps: true})

const Conversation = mongoose.model("Conversation", conversation)
export default Conversation 