const express = require("express")
const route = express.Router()
const {sendMessage, getConversation} = require('./messageController')
const ProtectedRoute = require("../../middlewares/ProtectedRoute")

route.post('/send/:senderId', ProtectedRoute, sendMessage)
route.get("/get/:senderId/:receiverId",ProtectedRoute, getConversation)

module.exports = route