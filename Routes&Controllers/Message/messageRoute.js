const express = require("express")
const route = express.Router()
const {sendMessage} = require('./messageController')

route.post('/send/:senderId', sendMessage)

module.exports = route