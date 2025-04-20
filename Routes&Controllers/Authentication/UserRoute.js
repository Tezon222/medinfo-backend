import express from 'express'
import multer from "multer"
import { getSingleUser, getUsers, loginUser, signupUser } from './UserController.js'
const route = express.Router()

const storage = multer.diskStorage({
  filename: (req,file, cb)=>{
    cb(null, file.originalname)
  }
})
const upload = multer({storage})


route.get("/", getUsers)
route.get("/:id", getSingleUser)
route.post("/signup", upload.single("license"), signupUser)
route.post("/login", loginUser)
route.put("/update/:id", (req,res)=>{
    res.send('Update single User')
})
route.delete("/delete/:id", (req,res)=>{
    res.send('Delete single User')
})

export default route