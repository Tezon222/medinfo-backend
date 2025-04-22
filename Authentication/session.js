import express from "express"
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
      const user = await User.findById(userId).select(['firstName', "email", "role"])
      if(!user){
         return res.status(400).json({message: "User does not exist"})
        }else{
         return  res.status(200).json({message: user})
        }
    
  } catch (error) {
    return res.status(400).json({message: error})
  }
      
   
  })

export default router