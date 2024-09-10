const express = require('express')
const app = express()
const {Server} = require("socket.io")
const {createServer} = require("http")
const server = createServer(app)


const io = new Server(server, {
    cors:{
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    } 
});
const getUserId = (userId) =>{
    return userId
}
io.on("connection", (socket) => {
    console.log("A user has connected")

    //when the user sends a request to us socket.on
    io.to(getUserId).emit('new message', )

    //when the user needs a response from us io.emit

    // When the user disconnects
    socket.on('disconnect', ()=>{
        console.log("A user has disconnected")
    })
})

module.exports = {server, app}