import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import messageRoute from "./Routes&Controllers/Message/messageRoute.js"
import dailyTipsRoute from "./Routes&Controllers/Dailytips/dailyTipsRouter.js"
import doctorRoute from "./Authentication/Doctor/doctorRouter.js"  
import patientRoute from "./Authentication/Patient/patientRouter.js"
import postRoute from "./Routes&Controllers/Messageboard/messageBoardRoute.js"
import diseasesRoute from "./Routes&Controllers/Ailment Archive/ailmentArchiveRouter.js"
import appointmentRoute from "./Routes&Controllers/Appointments/appointmentRouter.js"
import forgotPasswordRoute from "./Authentication/ForgotPassword.js" 
import dashboardRoute from "./Routes&Controllers/Dashboard/dashboardRoute.js" 
import UserRoute from "./Routes&Controllers/Authentication/UserRoute.js" 
import session from "express-session" 
import passport from "passport"
import {server, app} from "./utils/socket.io.js" 
import sessionRoute from './Authentication/session.js' 
import connectdb from "./database/mongodb.js"
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT

app.use(express.json())//JSON middleware
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: ["http://localhost:8000", "http://localhost:3000", "https://medical-info.vercel.app"],
  credentials: true,
}))
app.use(session({
  secret: 'suii',
  resave: false,
  saveUninitialized: true,
}))
app.use(cookieParser())
app.use(passport.authenticate('session'))
app.use(passport.initialize())
passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})
app.use("/session", sessionRoute)
app.use('/posts', postRoute)
app.use('/dailyTips', dailyTipsRoute)
app.use('/doctor', doctorRoute)
app.use('/message', messageRoute)
app.use('/patient', patientRoute)
app.use('/diseases', diseasesRoute)
app.use('/forgotpassword', forgotPasswordRoute)
app.use('/appointments', appointmentRoute)
app.use('/dashboard', dashboardRoute)
app.use('/user', UserRoute)

// connectSQLdb()
connectdb()

app.get("/login", (req, res)=>{  
    //  res.send("welcome")
     res.redirect("https://medical-info.vercel.app/signin?type=patient")
})
app.get("/", (req,res)=>{
  res.send("Medinfo Server")
})

import './utils/googleAuthenticate.js'
app.get('/auth/google',passport.authenticate('google', { scope:[ 'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/user.gender.read',
            "https://www.googleapis.com/auth/user.birthday.read" ] }));
app.get('/auth/google/callback', 
passport.authenticate('google', {
    failureRedirect: '/login'
  }), (req,res)=>{
    res.redirect(`https://medical-info.vercel.app/patient`)
  })
  
//catch errors middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: 'something broke', error: err});
});

server.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})
 