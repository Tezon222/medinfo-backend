import express from 'express'
import {getPatients,getSinglePatient, signupPatient,loginPatient} from "./patientController.js"
import multer from 'multer'
const route = express.Router()

const upload = multer()

route.get("/", getPatients)
route.get("/:id", getSinglePatient)
route.post("/signup", upload.none(), signupPatient)
route.post("/login", loginPatient)
route.put("/update/:id", (req,res)=>{
    res.send('Update single Patient')
})
route.delete("/delete/:id", (req,res)=>{
    res.send('Delete single Patient')
})

export default route