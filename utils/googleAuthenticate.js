const passport = require("passport")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const Patient = require("../Model/Users/patientSchema")
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACKURL,
    passReqToCallback   : true
  },
  async function verify(request, accessToken, refreshToken, profile, done) {
        const {id, family_name, email, given_name, picture } = profile
        const existingUser = await Patient.findOne({googleId: id})
        const existingUseremail = await Patient.findOne({email})
        if(existingUser || existingUseremail){
         return  done(null, existingUseremail)
        } else{
          const user = await Patient.create({firstName: family_name, googleId: id, email, picture, lastName: given_name, verified: true,gender: 'Male' })
          return done(null, user)
        }
  }
));
