import Messages from '../../Model/Messages/messageSchema.js'
import Conversation from "../../Model/Messages/conversationSchema.js"
import User from "../../Model/Users/userSchema.js"

export const sendMessage = async(req, res) =>{
        const {senderId} = req.params
        const {sender,receiverId, message} = req.body 
    
        if(!message || !sender || !receiverId || !senderId){
           return res.status(400).json({message: "Please enter valid message"})
        }
            const message_new = await Messages.create({senderId, sender: sender === "Doctor" ? "Doctor" : "Patient", receiverId, message, receiver: sender === "Doctor" ? "Patient" : "Doctor"})
            const conversationExisit = await Conversation.findOne({participants: {$all : [senderId, receiverId]}})

            const participants = [[senderId, receiverId], [receiverId, senderId]]
            participants.forEach(async(participant)=>{
                const user = await User.findById(participant[0])
                //Check if user is in the array of chats
                user.chatList.includes(participant[1]) ?
                //if true remove user from array then put at the beginning of the array else just add to the array
                    (user.chatList = [participant[1]].concat(user.chatList.filter((chatUserId)=> chatUserId != participant[1])), await user.save()) : 
                    (user.chatList.unshift(participant[1]),await user.save())  
            })

            if(!conversationExisit){
                const new_conversation = await Conversation.create({participants:[senderId, receiverId]})
                new_conversation.messageIds.push(message_new._id)
                new_conversation.save()
              return  res.status(200).json({message:"Message sent conversation and new conversation added"})
            }else if(conversationExisit){
                conversationExisit.messageIds.push(message_new._id)
                await conversationExisit.save()
               return res.status(200).json({message:"Message sent conversation exists"})
            }
} 

export const getChatList = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "No user id provided" });
    }
    
    try {
        const chatList = await User.findById(id).select('chatList').populate({
            path: 'chatList', 
            select: "firstName lastName picture _id"
        });
        
        const senderId = id;
        const receivers = chatList.chatList;
        
        const result = await Promise.all(receivers.map(async ({ _id, firstName, lastName, picture }) => {
            const conversation = await Conversation.findOne({
                participants: { $all: [senderId, _id] }
            })
            .sort({ updatedAt: -1 })
            .populate({
                path: 'messageIds',
                select: "message",
                options: { sort: { createdAt: -1 }, limit: 1 }
            })
            .lean();
            
            return {
                _id, 
                firstName, 
                lastName, 
                picture,
                lastMessage: conversation?.messageIds[0]?.message || null
            };
        }));
        return res.status(200).json({ message: result, senderId, receivers });
    } catch (error) {
        console.error("Error in getChatList:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getConversation = async(req, res) =>{
    const {senderId,receiverId} = req.params
    if(!senderId || !receiverId){
       return res.status(400).json({message: "Invalid request"})
    }

    const conversationExisit = await Conversation.findOne({participants: {$all : [senderId, receiverId]}}).populate('messageIds')
    if(!conversationExisit){
        return res.status(200).json({message: []})
    }
    console.log(conversationExisit)
    return res.status(200).json({message: conversationExisit.messageIds})
}