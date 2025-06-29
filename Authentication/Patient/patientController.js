// const {db} from("../../database/mySQLdb")
import sendCookies from "../../utils/cookies.js"
import User from "../../Model/Users/userSchema.js"
import moment from 'moment'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken" 

//GET All Patients
export const getPatients = async(req,res)=>{
  try {
    if(process.env.ENV === "Production"){
      const {accessToken} = req.cookies
      if(!accessToken){
        res.status(401).json({message: 'No access token'})
      }
      const verifyAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)
      const userId = verifyAccessToken.user_id
      const user = await User.findById(userId).select(['-password'])
      const allUsers = await User.find().select(['-password'])

      if(user.role === "Admin"){
        res.status(200).json({message: allUsers})
      }
      if(user.role === "Patient"){
        res.status(200).json({message: user})
      }
      if(!user){res.status(400).json({message: "User is not Authorized"})}
    }

    if(process.env.ENV === "development"){
      const users = await User.find().select(['-password'])
      res.status(200).json({message: users})
    }
  } catch (error) {
    res.status(400).json({message: error})
  }
}

//GET Single Patient
export const getSinglePatient = async(req,res)=>{
  try {
    const {id} = req.params
    const {accessToken} = req.cookies
    if(!accessToken ){
      res.status(401).json({message: 'No access token'})
    }
    const verifyAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)
    const userId = verifyAccessToken.user_id
    const user = await User.findById(userId).select(['-password'])
    if(!user){ res.status(400).json({message: "User does not exist"})}
    res.status(200).json({message: user})
  } catch (error) {
    res.status(400).json({message: error})
  }
}

// signup Patients
export const signupPatient = async(req,res)=>{
    const {firstName, lastName, email, password, country, gender, dob} = req.body
    if(Object.keys(req.body).length < 7 && Object.values(req.body) > 7){
          res.status(400).json({message: "Please fill all fields"}) ;
     } 
    const user =await User.findOne({email});
    if(user){
      res.status(400).json({message:"User already exists"})
    }
    else if(!user){
    const securePassword = await bcrypt.hash(password, 10)
    const avatar = `https://avatar.iran.liara.run/public/${gender === "Male" ? "boy" : "girl"}`
    const user = await User.create({firstName, lastName, email, password: securePassword, country, gender, dob, picture: avatar})
    res.status(201).json({message: "User Signup Successful", User:{name: user.firstName}} )
    }
       
}

// Login patients
export const loginPatient = async(req,res) =>{
    const {email, password} = req.body 
    try {
        const user = await User.findOne({email}).select('+password')
        if(!user){
          res.status(400).json({message:"Invalid username or Password"})
        }else if(!user.password){
          res.status(400).json({message: "User can only signin with Google"})
      }else if(await bcrypt.compare(password, user.password)){
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
        res.status(400).json({message:error})
    }
}

