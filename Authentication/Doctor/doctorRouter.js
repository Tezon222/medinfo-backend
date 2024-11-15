const express = require('express')
const route = express.Router()
const {getDoctors, getSingleDoctor, signupDoctor, loginDoctor} = require("./doctorController")
const multer = require("multer")

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

module.exports = route