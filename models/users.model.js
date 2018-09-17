const mongoose  = require('mongoose')
const crypto    = require('crypto')
const jwt       = require('jsonwebtoken')
const { Schema } = mongoose
const uniqueValidator = require('mongoose-unique-validator')

const UsersSchema = new Schema({
    username: { type : String , unique : true, required : true, dropDups: true },
    email: { type : String , unique : true, required : true, dropDups: true },
    hash: String,
    salt: String,
    website: { type : String , default: "" }
})
UsersSchema.plugin(uniqueValidator, { type: 'userDuplicated' })

UsersSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UsersSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

UsersSchema.methods.generateJWT = function() {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    return jwt.sign({
    username: this.username,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'project number one')
}

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        username: this.username,
        website: this.website,
        email: this.email,
        token: this.generateJWT(),
    }
}

UsersSchema.methods.welcomeData = function() {
    return {
        message: `Hello ${this.username}, this is your token: Token ${this.generateJWT()}`,
        usage: 'Authorization: your token'
    }
}

mongoose.model('Users', UsersSchema)
