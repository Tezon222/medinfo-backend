const Messages = require('../../Model/Messages/messageSchema')
const Conversation = require("../../Model/Messages/conversationSchema")

const sendMessage = async(req, res) =>{
    const {senderId} = req.params
    const {sender,receiverId, message} = req.body 

    if(!message || !sender || receiverId || senderId){
        res.status(400).json({message: "Please enter valid "})
    }
        const message_new = await Messages.create({senderId, sender: sender === "Doctor" ? "Doctor" : "Patient", receiverId, message, receiver: sender === "Doctor" ? "Patient" : "Doctor"})
        const conversationExisit = await Conversation.findOne({participants: {$all : [senderId, receiverId]}})

        if(!conversationExisit){
            const new_conversation = await Conversation.create({participants:[senderId, receiverId]})
            new_conversation.messageIds.push(message_new._id)
            new_conversation.save()
        }else{
            conversationExisit.messageIds.push(message_new._id)
            await conversationExisit.save()
        }
} 

module.exports = {sendMessage}