import express from 'express'
import {sendEmail} from '../utils/sendEmail.js'
import paths from "path"
import User from '../Model/Users/userSchema.js'
const route = express.Router() 

route.get("/", async(req,res)=>{
    const {email} = req.body

    if(!email){
        return res.status(400).json({message: "Please enter Email"})
    }
    const user = await User.findOne({email})
    if(!user){
       return res.status(400).json({message: "User does not exist"})
    }
    else{
        const otp =  Math.floor(1000 + Math.random() * 9000)
        const secureotp = await bcrypt.hash(otp.toString(), 10)  
        user.otp = secureotp
        await user.save()
        sendEmail(email, user.firstName, "Forgot Password", otp, paths.join(__dirname, '../views/token.ejs'))
    }
})

route.post('/verify', async(req,res)=>{
    const {token, email, password} = req.body
    const user = await User.findOne({email})
    const isVerified = await bcrypt.compare(token, user.otp) 
     if(!isVerified){
        return res.status(400).json({message: "Invalid token"})
    } else{
        const securePassword = await bcrypt.hash(password, 10)
        user.password = securePassword
        await user.save()
        return res.status(200).json({message: "User password successfully updated"})
    }
  })

export default route