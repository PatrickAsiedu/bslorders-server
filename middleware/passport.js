const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


// jwt options
const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY,
}


const strategy = new JWTStrategy(options, async(payload, done) => {
    // payload contains all info used to sign the token
    // console.log(payload.type)

    // check and append account type to the req.. accessed by req.user

    try {
        // if user, append user
        if(payload.type === 'user'){
            const user ={
                ... payload
            }
            done(null, {user})
        }
        
        // if chef, append chef
        if(payload.type === 'chef'){
            const chef ={
                ... payload
            }
            done(null, {chef})
        }

        // if admin, append admin
        if(payload.type === 'admin'){
            const admin ={
                ... payload
            }
            done(null, {admin})
        }
        




    } catch (error) {
        console.log(error)
        done(error)
    }
})

passport.use('jwt', strategy )


module.exports = passport;