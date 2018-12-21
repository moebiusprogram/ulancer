const mongoose   = require('mongoose')
const crypto     = require('crypto')
const jwt        = require('jsonwebtoken')
const passport   = require('passport')
const { Schema } = mongoose
const constants  = require('../config/constants.config')
const uniqueValidator = require('mongoose-unique-validator')

const AccountsSchema = new Schema({
    accountID: { type : String, unique : true, required : true },
    email:{ type : String, unique : true, required : true },
    name: { type : String, required : true },
    lastname: { type : String, required : true },
    hash: { type : String },
    salt: { type : String },
    document_type:  { type : String, enum: ['cedula', 'extranjero', 'pasaporte'], required : true },
    document_number:{ type : String, required : true },
})
AccountsSchema.plugin(uniqueValidator)

AccountsSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

AccountsSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

AccountsSchema.methods.generateJWT = function() {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    return jwt.sign({
        name: `${this.name} ${this.lastname}`,
        accountID: this.accountID,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, constants.SECRET )
}


exports.Accounts = mongoose.model('Accounts', AccountsSchema)
exports.Test = mongoose.model('Test', AccountsSchema)
