const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectMongodb = require("./database/mongodb")
// const {connectSQLdb} = require("./database/mySQLdb")
const messageRoute = require("./Routes&Controllers/Message/messageRoute")
const dailyTipsRoute = require("./Routes&Controllers/Dailytips/dailyTipsRouter.js")
const doctorRoute = require("./Authentication/Doctor/doctorRouter")
const patientRoute = require("./Authentication/Patient/patientRouter")
const postRoute =  require("./Routes&Controllers/Messageboard/messageBoardRoute.js")
const diseasesRoute = require("./Routes&Controllers/Ailment Archive/ailmentArchiveRouter.js")
const appointmentRoute = require("./Routes&Controllers/Appointments/appointmentRouter.js")
const forgotPasswordRoute = require("./Authentication/ForgotPassword")
const session = require("express-session")
const passport = require("passport")
const paths = require("path")
const {sendEmail} = require("./utils/sendEmail.js")
const {app, server} = require("./utils/socket.io.js")

require("dotenv").config()

const port = process.env.PORT

app.use(express.json())//JSON middleware
app.use(express.urlencoded({extended: false}))
app.use(cors())
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

app.use('/posts', postRoute)
app.use('/dailyTips', dailyTipsRoute)
app.use('/doctor', doctorRoute)
app.use('/message', messageRoute)
app.use('/patient', patientRoute)
app.use('/diseases', diseasesRoute)
app.use('/forgotpassword', forgotPasswordRoute)
app.use('/bookAppointment', appointmentRoute)

// connectSQLdb()
connectMongodb()

app.get("/login", (req, res)=>{
    //  res.send("welcome")
     res.redirect("https://medical-info.vercel.app/signin?type=patient")
})

require('./utils/googleAuthenticate.js')
app.get('/auth/google',passport.authenticate('google', { scope:[ 'email', 'profile' ] }));
app.get('/auth/google/callback', 
passport.authenticate('google', {
    failureRedirect: '/login'
  }), (req,res)=>{
    res.redirect(`https://medical-info.vercel.app/?id=${req.user._id}`)
  })
  
//catch errors middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: 'something broke', error: err});
});

server.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})
