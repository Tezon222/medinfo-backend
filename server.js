const express = require("express")
const mongoose = require("mongoose")
// const {connectSQLdb} = require("./database/mySQLdb")
const connectMongodb = require("./database/mongodb")
const dailyTipsRoute = require("./Routes&Controllers/Dailytips/dailyTipsRouter.js")
const doctorRoute = require("./Authentication/Doctor/doctorRouter")
const patientRoute = require("./Authentication/Patient/patientRouter")
const postRoute =  require("./Routes&Controllers/Messageboard/messageBoardRoute.js")
const diseasesRoute = require("./Routes&Controllers/Ailment Archive/ailmentArchiveRouter.js")
const messageRoute = require("./Routes&Controllers/Message/messageRoute")
const forgotPasswordRoute = require("./Authentication/ForgotPassword")
const passport = require("passport")
const paths = require("path")
const {sendEmail} = require("./utils/sendEmail.js")
const session = require("express-session")
require("dotenv").config()

const app = express()
const port = process.env.PORT

app.use(express.json())//JSON middleware
app.use(express.urlencoded({extended: false}))
app.use(session({
  secret: 'suii',
  resave: false,
  saveUninitialized: true,
  }))
  app.use(passport.authenticate('session'))
  app.use(passport.initialize())
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  app.get('/session', (req,res)=>{
    res.send(req.user)
  })
  app.use('/posts', postRoute)
  app.use('/dailyTips', dailyTipsRoute)
  app.use('/doctor', doctorRoute)
  app.use('/patient', patientRoute)
  app.use('/diseases', diseases)
  app.use('/forgotpassword', forgotPasswordRoute)
  app.use('/message', messageRoute)
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

app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})
