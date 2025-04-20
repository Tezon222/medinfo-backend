import express from "express"
const route = express.Router()
import {sendMessage, getConversation, getChatList} from './messageController.js'
import ProtectedRoute from "../../middlewares/ProtectedRoute.js"

route.post('/send/:senderId',  sendMessage)
route.get("/get/:senderId/:receiverId", getConversation)
route.get("/chatlist/:id", getChatList)

export default route 