import express from "express"
import Patient from "../Model/Users/patientSchema.js"
import Doctor from "../Model/Users/doctorSchema.js"
import jwt from "jsonwebtoken"
const router = express.Router()

router.get("/", async(req,res)=>{
    const {accessToken} = req.cookies
  
  try {
    if(!accessToken ){
        return res.status(401).json({message: 'No access token'})
      }
      const verifyAccessToken = await jwt.verify(accessToken, process.env.JWT_SECRET)
      const userId = verifyAccessToken.user_id
      const patient = await Patient.findById(userId).select(['firstName', "email", "role"])
      const doctor = await Doctor.findById(userId).select(['firstName', "email", "role"])
      if(!patient && !doctor){
         return res.status(400).json({message: "User does not exist"})
        }else{
         return  res.status(200).json({message: doctor || patient})
        }
    
  } catch (error) {
    res.status(400).json({message: error})
  }
      
   
  })

export default router