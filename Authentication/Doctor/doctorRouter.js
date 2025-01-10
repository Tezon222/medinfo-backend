import express from 'express'
import {getDoctors, getSingleDoctor, signupDoctor, loginDoctor} from "./doctorController.js"
import multer from "multer"
const route = express.Router()

const storage = multer.diskStorage({
  filename: (req,file, cb)=>{
    cb(null, file.originalname)
  }
})
const upload = multer({storage})


route.get("/", getDoctors)
route.get("/:id", getSingleDoctor)
route.post("/signup", upload.single("license"), signupDoctor)
route.post("/login", loginDoctor)
route.put("/update/:id", (req,res)=>{
    res.send('Update single doctor')
})
route.delete("/delete/:id", (req,res)=>{
    res.send('Delete single doctor')
})

export default route