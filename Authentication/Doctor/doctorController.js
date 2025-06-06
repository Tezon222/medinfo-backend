// const {db} from("../../database/mySQLdb")
import User from "../../Model/Users/userSchema.js"
import emailValidator from '../../utils/emailValidator.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import  sendCookies from "../../utils/cookies.js"
import {cloudinary} from "../../utils/cloudinary.js"

// Get All Doctors
export const getDoctors = async(req,res)=>{
  const users = await User.find()
  res.status(200).json({message: users})
}

// Get Single Doctor
export const getSingleDoctor = async(req,res)=>{
  try {
    const {id} = req.params
    if(!id){
      res.status(400).json({message:"Please enter an ID"})
    }
    const user = await User.findById(id)
    if(!user){ res.status(400).json({message: "Doctor does not exist"})}
    res.status(200).json({message: user})
  } catch (error) {
    res.status(400).json({message:error})
  }
}

// signup Doctors
export const signupDoctor = async(req,res)=>{
        const {firstName, lastName, email, password, country, specialty, gender} = req.body
        try {  
            if(!firstName || !lastName || !email || !password || !country || !specialty || !gender){
                res.status(400).json({message: "Please fill all fields"})  
            } 
    const user =await User.findOne({email});
    const emailTrue = emailValidator(email)  
    if(!emailTrue){
      res.status(400).json({message:"please enter a valid Email"})
    }
    if(!user){
    const securePassword = await bcrypt.hash(password, 10)
    const avatar = `https://avatar.iran.liara.run/public/${gender === "Male" ? "boy" : "girl"}`
    cloudinary.uploader.upload(req.file.path,{folder:"Event Featured images"}, async(err, result)=>{
      if(err){
        res.status(400).json({message: "Please upload a valid file"})
      }if(result){
        await User.create({firstName, lastName, email, password: securePassword, country, specialty, medicalCert: result.secure_url, gender, picture: avatar, role:"Doctor"})
        res.status(201).json({message: "Doctor Signup Successful", User:{name: firstName}} )
      }
    })    
    }else if(user){
      res.status(400).json({message:"Doctor already exists"})
    }
        } catch (error) {
            console.log(error)
            res.status(400).json({message:error})
        }
}

// Login Doctors
export const loginDoctor = async(req,res) =>{
    const {email, password} = req.body
    try {
        const user = await Doctor.findOne({email})
        if(!user){
          res.status(400).json({message:"Invalid username or Password"})
        }else if(user && await bcrypt.compare(password, user.password)){
          const user_id = user._id
          const accessToken = await jwt.sign({user_id}, process.env.JWT_SECRET, {expiresIn: "30d"})
          sendCookies("accessToken", accessToken, res)
          res.status(200).json({message: `Login Successful, welcome ${user.firstName}`})
        }else{
          res.status(400).json({message: "Invalid username or password"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error.Error})
    }
}

