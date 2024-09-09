const express = require('express')
const route = express.Router()
const {getPatients,getSinglePatient, signupPatient,loginPatient} = require("./patientController")

route.get("/", getPatients)
route.get("/:id", getSinglePatient)
route.post("/signup", signupPatient)
route.post("/login", loginPatient)
route.put("/update/:id", (req,res)=>{
    res.send('Update single Patient')
})
route.delete("/delete/:id", (req,res)=>{
    res.send('Delete single Patient')
})

module.exports = route