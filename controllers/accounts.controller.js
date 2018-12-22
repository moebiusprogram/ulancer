const passport  = require('passport')
const mongoose  = require( 'mongoose' )
const utils     = require( '../utils' )
const jwt   = require('jsonwebtoken')
const Profile  = mongoose.model( 'Profile' )
const Courses  = mongoose.model( 'Courses' )
const _ = require('lodash')

exports.signin = (req, res, next) => {

    const { body: { account } } = req

    if(!account)
    return res.status(422).json( errorMessage("Error validating account. Please verify data") )
    
    if( !account.login  || !account.password ) {
        return res.status(422).json( errorMessage("Username or email invalid") )
    }

    //TODO: Implementar sanitizacion de los campos
    account.user = account.login
    
    return passport.authenticate('local', 
        { session: false, passReqToCallback: true
    }, (err, passportUser, info) => {
        if(err) {
          return next(err)
        }

        if(passportUser) {
          return res.json( signinMessage( passportUser.generateJWT() ) )
        }

        return res.status(401).json( errorMessage("Authentication Error. Please verify data") )
    })(req, res, next)
}

exports.signup = (req, res, next) => {

    const { body: { account } } = req

    if(!account)
    return res.status(422).json( errorMessage("Error validating account. Please verify data") )

    if(!account.name) {
        return res.status(422).json(errorMessage( "name is required" ))
      }
      
    if(!account.lastname) {
        return res.status(422).json(errorMessage( "lastname is required" ))
      }
      
    if(!account.email) {
        return res.status(422).json(errorMessage( "email is required" ))
    }

    if(!account.password) {
        return res.status(422).json(errorMessage( "password is required" ))
    }

    //TODO: Implementar sanitizacion de los campos
    checkedAccount = {
        name: account.name,
        lastname: account.lastname,
        email: account.email,
        document_type: account.document_type,
        document_number: account.document_number,
        accountID: utils.generateAccountID()
    }

    //Test database or Accounts database
    const ActualDB = utils.actualDB( req )
    const finalAccount = new ActualDB(checkedAccount)

    finalAccount.setPassword(account.password)

    finalAccount.save( function (err, account ) {
        if(err){
            if(11000 === err.code) {
                return res.status(422).json( errorMessage("Duplicated error"))
            }
            
            if(Object.values(err.errors)[0].message) {
                let message = Object.values(err.errors)[0].message
                return res.status(422).json(errorMessage(message))
            } 
            return res.status(422).json( errorMessage("Cannot complete the registration"))
        }
        return res.json( signupMessage( account ) )
    })
}

exports.getToken = (req, res) => {
    const token = jwt.sign({
      data: 'memento homo'
    }, 'expected secret', { expiresIn: '60s' })

    return res.json({token: token})
}

//get
exports.getProfile = async (req, res) => {

    const { account: { accountID } } = req

    const ActualDB = utils.actualDB(req)

    console.log("actualID", accountID )
    
    const account = await ActualDB.findOne({ accountID: accountID }).exec()

    if (!account) {
        return res.status(401).json(utils.errorMessage("Cannot get profile data"))
    }

    const profile = await Profile.findOne({accountID: accountID}).exec()

    if(!profile) {
        return res.json({
        name: account.name,
        lastname: account.lastname,
        motto: "",
        bio: ""
        })
    } else {
        return res.json({
        name: account.name,
        lastname: account.lastname,
        motto: profile.motto,
        bio: profile.bio
        })
    }
}

//post
exports.saveProfile = async (req, res) => {

    const { account: { accountID } } = req

    const ActualDB = utils.actualDB(req)

    console.log("actualID", accountID )

    const account = await ActualDB.findOne({ accountID: accountID }).exec()

    ActualDB.findOne({ accountID: accountID })
    .then( account => {
        if (!account) {
            return res.status(401).json(utils.errorMessage("Cannot get profile data"))
        }

        if( req.body.profile.name ) {
            account.name = req.body.profile.name
        }

        if( req.body.profile.lastname ) {
            account.lastname = req.body.profile.lastname
        }
        
        account.save()   
    }).catch(err => {
        console.warn(err)
    })

    const editableFields = [
        "motto",
        "bio"
    ]

    let updatedData = {}

    //Filter data
    for (var key in req.body.profile ) {

        if (req.body.profile.hasOwnProperty(key) &&
            req.body.profile[key] !== "",
            utils.arrayContains(editableFields, key)
        ) {
            updatedData[key] = req.body.profile[key]
        }
    }

    console.log( "Updated data: ",updatedData )

    //Nothing was updated
    if (_.isEmpty(updatedData)) {

        return res.status(422).json(
            utils.errorMessage("Nothing was updated"))
    }

    const profile = await Profile.findOneAndUpdate({ accountID: accountID},updatedData).exec()

    if(!profile) {
        updatedData.accountID =  accountID
        await Profile.create( updatedData ) 
    }
    /*
    else {
        profile.accountID = accountID
        profile.save(updatedData)
    }*/

    return res.json(utils.successMessage("Saved successfully"))
}

//get
exports.getCourses = async (req, res) => {

    const courses = await Courses.find({}).exec()

    if(courses) {
        return res.json({model: courses})
    } else {
        return res.json({model:[]})
    }
}


exports.verifyToken = (req, res) => {
    let token = req.query.token
    let decoded = 'decoded'

    jwt.verify(token, 'expected secret', function(err, decoded) {
        console.log(decoded)
        console.log("Err: ", err )
        if(err) {
             return res.send({ response: err })
        } else {
             return res.send({ response: true })
        }
    })
}

exports.list = (req, res, next) => {

    //Test database or Accounts database
    const ActualDB = utils.actualDB( req )
    
    ActualDB.find()
    .then( account => {
        res.send(account)
    }).catch(err => {
        res.status(422).send({ error: "Error retrieving accounts"})
    }) 
}

exports.cleardb = (req, res, next) => {

    //Test database or Accounts database
    const ActualDB = utils.actualDB( req )
    
    ActualDB.remove({}, (err) => {
        if(err) {
            res.status(422).send({ error: "Error deleting entries"})
        }
        
        res.send({ message: "Successfully cleared"})
    })
}

errorMessage = ( message ) => {
    return {
        success: false,
        error: message
    }
}

signupMessage = ( account ) => {
    return {
        success: true,
        user: {
            name: account.name,
            email: account.email,
            phone: account.phone,
            document_type: account.document_type,
            document_number: account.document_number,
            type: account.type,
            website: account.website,
            auth_token: account.generateJWT()
        }
    } 
}

signinMessage = ( token ) => {
    return {
        success: true,
        auth_token: token
    }
} 
