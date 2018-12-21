const passport   = require('passport')
const constants  = require('./constants.config')
const utils      = require( '../utils' )
const LocalStrategy = require('passport-local')
const JwtStrategy   = require('passport-jwt').Strategy
const ExtractJwt    = require('passport-jwt').ExtractJwt


passport.use(new LocalStrategy({
    usernameField: 'account[login]',
    passwordField: 'account[password]',
    passReqToCallback: true
},
(req, user, password, done) => {

    //Test database or Accounts database
    const ActualDB = utils.actualDB( req )

    ActualDB.findOne({$or: [ {email: user},{phone:user } ]})
        .then((account) => {
            if(!account || !account.validPassword(password)) {
                return done(null, false, { message: "Error validating account. Please verify data" })
            }
                return done(null, account )
    }).catch(done)
}))

passport.use(new JwtStrategy({
    secretOrKey : constants.SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
},
(req, jwt_payload, done) => {

    //Test database or Accounts database
    const ActualDB = utils.actualDB(req)

    ActualDB.findOne({ accountID: jwt_payload.accountID }, function ( err, account ) {
	if ( err ) {
	    return done(null, false, { message: "Error validating token" })
	}
	if ( account ) {
		req.account = account
	    return done(null, account)
	} else {
	    return done(null, false, { message: "Error validating token" })
	}
    })
}))

/*
passport.use(new JwtStrategy({
    secretOrKey: config.jwt.signinSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
},
	( req, jwt_payload, done ) => {

    //Test database or Accounts database
    const ActualDB = utils.actualDB(req)

    ActualDB.findOne({ accountID: jwt_payload.id }, function ( err, account ) {
	if ( err ) {
	    return done(null, false, { message: "Error validating token" })
	}
	if ( account ) {
		req.account = account
	    return done(null, account)
	} else {
	    return done(null, false, { message: "Error validating token" })
	}
    })
}))*/
