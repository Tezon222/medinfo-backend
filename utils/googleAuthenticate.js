const passport = require("passport")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const Patient = require("../Model/Users/patientSchema")
const { callApi } = require("@zayne-labs/callapi/legacy")

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACKURL,
    passReqToCallback   : true
  },
  async function verify(request, accessToken, refreshToken, profile,done) {
        const {id, family_name, email, given_name, picture } = profile
        const existingUser = await Patient.findOne({googleId: id})
        const existingUseremail = await Patient.findOne({email})
        if(existingUser || existingUseremail){
         return  done(null, existingUseremail)
        } else{
          const { data, error } = await callApi("https://people.googleapis.com/v1/people/me", {
            auth:accessToken,
            query:{
              key: process.env.GOOGLE_AUTH_APIKEY,
              personFields: "genders,birthdays"
            }
          })
          if(error == null){
            const gender = data.genders[0].formattedValue
            const user = await Patient.create({firstName: family_name, googleId: id, email, picture, lastName: given_name, verified: true,gender })
            return done(null, user)
          }else{
            return done(error, null)
          }
          
        }
  }
));
