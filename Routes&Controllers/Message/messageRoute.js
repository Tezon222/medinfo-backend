import express from "express"
const route = express.Router()
import {sendMessage, getConversation, getChatList} from './messageController.js'
import ProtectedRoute from "../../middlewares/ProtectedRoute.js"

route.post('/send/:senderId', ProtectedRoute, sendMessage)
route.get("/get/:senderId/:receiverId",ProtectedRoute, getConversation)
route.get("/get/chatList/:Id",ProtectedRoute, getChatList)

export default route 