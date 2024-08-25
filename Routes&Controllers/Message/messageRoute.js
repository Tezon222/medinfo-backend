const express = require("express")
const route = express.Router()

route.get('/send', (req,res)=>{
    res.send("send messages")
})

module.exports = route