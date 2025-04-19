// const {db} from("../../database/mySQLdb")
import User from "../../Model/Users/userSchema.js"
import emailValidator from '../../utils/emailValidator.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import  sendCookies from "../../utils/cookies.js"
import {cloudinary} from "../../utils/cloudinary.js"

// Get All Users
export const getUsers = async(req,res)=>{
    const {role} = req.query
  const users = await User.find().where("role").equals()
  res.status(200).json({message: users})
}

// Get Single User
export const getSingleUser = async(req,res)=>{
    const {role} = req.query
  try {
    const {id} = req.params
    if(!id){
      res.status(400).json({message:"Please enter an ID"})
    }
    const user = await User.findById(id)
    if(!user){ res.status(400).json({message: "User does not exist"})}
    res.status(200).json({message: user})
  } catch (error) {
    res.status(400).json({message:error})
  }
}

// signup Users
export const signupUser = async(req,res)=>{
    const {role} = req.query
    const {firstName, lastName, email, password, country, gender, dob, medicalCert, specialty} = req.body
        try {  
            if(!firstName || !lastName || !email || !password || !country || !dob || !gender){
               return res.status(400).json({message: "Please fill all fields"})  
            } 
if(role === 'doctor' && !medicalCert && !specialty){
    return res.status(400).json({message: "Please fill the specialty field and provide a Medical Certificate"})
}
    const user =await User.findOne({email});
    const emailTrue = emailValidator(email)  
    if(!emailTrue){
      res.status(400).json({message:"please enter a valid Email"})
    }
    if(!user){
    const securePassword = await bcrypt.hash(password, 10)
    const avatar = `https://avatar.iran.liara.run/public/${gender === "Male" ? "boy" : "girl"}`
    
    role === "doctor" &&
     cloudinary.uploader.upload(req.file.path,{folder:"Event Featured images"}, async(err, result)=>{
      if(err){
        res.status(400).json({message: "Please upload a valid file"})
      }if(result){
        await User.create({firstName, lastName, email, password: securePassword, country, specialty, medicalCert: result.secure_url, gender, picture: avatar})
        return res.status(201).json({message: "User Signup Successful", User:{name: firstName}} )
      } 
    });
        await Patient.create({firstName, lastName, email, password: securePassword, country, gender, dob, picture: avatar})
      return  res.status(201).json({message: "User Signup Successful", User:{name: firstName}} )
    }else if(user){
      res.status(400).json({message:"User already exists"})
    }
        } catch (error) {
            console.log(error)
            res.status(400).json({message:error})
        }
}

// Login Users
export const loginUser = async(req,res) =>{
    const {role} = req.query
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
          res.status(400).json({message:"Invalid username or Password"})
        }else if(user && await bcrypt.compare(password, user.password)){
          const user_id = user._id
          const accessToken = await jwt.sign({user_id}, process.env.JWT_SECRET, {expiresIn: "30d"})
          sendCookies("accessToken", accessToken, res)
          const currentMonth = moment().format('YYYY-MM')
            const loginRecord = user.logins.find((record) => record.month === currentMonth)

            if (loginRecord) {
              // Increment the login count for the current month
              loginRecord.count += 1
            } else {
              // Add a new record for the current month
              user.logins.push({ month: currentMonth, count: 1 })
            }
         
            // Save the updated user document
            await user.save()

          res.status(200).json({message: `Login Successful, welcome ${user.firstName}`})
        }else{
          res.status(400).json({message: "Invalid username or password"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error.Error})
    }
}

