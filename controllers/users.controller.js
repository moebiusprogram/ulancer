const mongoose  = require('mongoose')
const passport  = require('passport')
const { Schema } = mongoose
const Users = mongoose.model('Users')
const jwt   = require('jsonwebtoken')


exports.check_token = ( req, res ) => {
    let token = req.query.token
    let decoded = 'decoded'

    jwt.verify(token, 'project number one', function(err, decoded) {
        return res.send({response: true })
        
        if(err) {
             return res.send({ response: false })
        } else {
             return res.send({ response: true })
        }
    })
}

exports.list = (req, res) => {
    Users.find()
    .then( users => {
        res.send(users)
    }).catch(err => {
        res.status(400).send({ error: "Error retrieving users"})
    })
}
exports.register = (req, res, next) => {

    const { body: { user } } = req

    if(!user.username) {
        return res.status(400).json({
          errors: {
            username: 'is required',
          },
        })
      }

    if(!user.email) {
        return res.status(400).json({
          errors: {
            email: 'is required',
          },
        })
    }

    if(!user.password) {
        return res.status(400).json({
          errors: {
            password: 'is required',
          },
        })
    }

    const finalUser = new Users(user)
    finalUser.setPassword(user.password)

    finalUser.save( function (err, user ) {
        if(err){
            if(err.code == 11000 || err.name == 'ValidationError') {
                return res.status(400).json({error : "User is already registered"})
            }
            return res.status(400).json({error : "Cannot complete the registration"})
        }
        return res.json({ user: finalUser.welcomeData() })
    })
}

exports.login = (req, res, next) => {
    

    const { body: { user } } = req
  
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
              return res.status(400).json(
              { errors: "Verify Content-Type as Application/json",}) 
    }

    if(  !req.body.user ) {
        res.status(400).json({ errors: "username or password invalid" })
    }

    if(!user.username) {
        return res.status(400).json({
          errors: {
            username: 'is required',
          },
        })
    }

    if(!user.password) {
        return res.status(400).json({
          errors: {
            password: 'is required',
          },
        })
    }

    return passport.authenticate('local', 
        { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err)
    }

    if(passportUser) {
      const user = passportUser
      user.token = passportUser.generateJWT()
      return res.json({ user: passportUser.welcomeData() })
    }

    return res.status(400).json({
      errors: {
        "username or password": "invalid"
      },
    })
    })(req, res, next)

}
