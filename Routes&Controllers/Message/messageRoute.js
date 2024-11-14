const express = require("express")
const route = express.Router()
const {sendMessage, getConversation} = require('./messageController')

route.post('/send/:senderId', sendMessage)
route.get("/get/:senderId/:receiverId", getConversation)

module.exports = route