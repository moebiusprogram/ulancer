const passport  = require('passport')
const mongoose  = require('mongoose')
const Accounts  = mongoose.model('Accounts')
const Test      = mongoose.model('Test')

const util = {
    required: passport.authenticate('jwt', { session: false }),
    actualDB: (req) => {
      return (req.route.path.split("/")[2] == "test" )?
      Test : Accounts
}
}

module.exports = util
