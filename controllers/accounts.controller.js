const passport  = require('passport')
const utils     = require( '../utils' )
const jwt   = require('jsonwebtoken')



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

    if(!account.email) {
        return res.status(422).json(errorMessage( "email is required" ))
    }

    if(!account.password) {
        return res.status(422).json(errorMessage( "password is required" ))
    }

    //TODO: Implementar sanitizacion de los campos
    checkedAccount = {
        name: account.name,
        email: account.email,
        document_type: account.document_type,
        document_number: account.document_number,
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
