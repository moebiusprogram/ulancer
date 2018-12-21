/* beautify preserve:start */
const passport  = require( 'passport' )
const mongoose  = require( 'mongoose' )
const AWS       = require( 'aws-sdk' )
const Accounts  = mongoose.model( 'Accounts' )
const Test      = mongoose.model( 'Test' )
const Phone     = require( 'phone' )
const _         = require('lodash')
const handlebars= require('handlebars')
const fs        = require('fs')
const path      = require('path')
const PNF       = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()
/* beautify preserve:end */

const util = {
    authRequired: passport.authenticate('jwt', { session: false }),
    actualDB: (req) => {
        return (req.params.version === "test") ?
            Test : Accounts
    },
    actualDBbyName: (name) => {
        return ("test" === name) ? Test : Accounts
    },
    errorMessage: (message) => {
        return {
            success: false,
            error: message
        }
    },
    successMessage: (message, data = {}) => {
        data.success = true
        data.message = message
        return data
    },
    //signupMessage: ( req, account, email_token, merchant ) => {
    signupMessage: (req, account, email_token) => {

        return {
            success: true,
            user: {
                name: account.name,
                lastname: account.lastname,
                email: account.email,
                phone: account.phone,
                document_type: account.document_type,
                document_number: account.document_number,
                type: account.type,
                website: account.website,
                email_token: email_token,
                //accountID: account.accountID,
                //merchant: _.pick(merchant, ['merchantID', 'isTest', 'apiKey'])
            }
        }
    },
    bankingMessage: (message, data) => {
        return {
            success: true,
            message: message,
            data: {
                name: data.name,
                lastname: data.lastname,
                clabe: data.clabe,
            }
        }
    },
    merchantListMessage: (merchantList) => {

        let merchants = []

        let result = {
            success: true,
            merchant: merchants
        }

        merchantList.forEach((merchant) => {
            let details = {
                name: merchant.name,
                apiKey: merchant.apiKey,
                merchantID: merchant.merchantID,
                created: merchant.createdAt,
                isTest: merchant.isTest
            }
            merchants.push(details)
        })

        return result
    },
    signinMessage: (token) => {

        return {
            success: true,
            auth_token: token
        }
    },
    profileMessage: (account) => {
        return {
            success: true,
            profile: {
                name: account.name,
                lastname: account.lastname,
                phone: account.phone,
                birthdate: account.birthdate,
                document_number: account.document_number,
                country: account.country,
                type: account.type,
                email: account.email,
                accountID: account.accountID
            }
        }
    },
    txMessage: (message, data) => {

        let tx = []

        if (data.constructor === Array) {

            data.forEach((element) => {

                let details = {
                    address: element.address,
                    hash: element.hash,
                    amount: element.amount,
                    tx_id: element.tx_id,
                    user_id: element.user_id,
                    currency: element.currency,
                    txToken: element.txToken,
                    status: element.status,
                    currency: element.currency,
                    name: (element.merchant !== null) ? element.merchant.name : "",
                    merchantID: (element.merchant !== null) ? element.merchant.merchantID : "",
                    apiKey: (element.merchant !== null) ? element.merchant.apiKey : "",
                    cryptoCurrency: element.cryptoCurrency,
                    cryptoAmount: element.cryptoAmount,
                }
                tx.push(details)
            })
        }

        let result = {
            success: true,
            message: message,
            tx: tx
        }

        return result

    },
    CustomError: (name, message) => {

        this.name = name
        this.message = message
    },
    getCountryPhone: (number) => {

        if (number && number[0] === '+') {
            result = Phone(number)
            return { country: result[1] }
        } else if (number && number.length > 10) {
            result = Phone(`+${number}`)
            return { country: result[1] }
        } else {
            return { country: 'not found' }
        }
    },
    sendSNS: (number, code, message = '') => {

        const msg = (message === '') ? `Su código de verificación es: ${ code }` : message

        AWS.config.update({
            region: 'us-east-1',
            accessKeyId: 'AKIAIHUXM3UMEKBQFTQA',
            secretAccessKey: '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',
        })

        var code = number.substring(0, 2)

        let country = ""

        switch (code) {
            case "57":
                {
                    country = "CO"
                }
                break
            case "58":
                {
                    country = "VE"
                }
                break
            case "52":
                {
                    country = "MX"
                }
        }

        const intlNumber = phoneUtil.parseAndKeepRawInput(number, country);

        const phoneNum = phoneUtil.format(intlNumber, PNF.E164)

        const sns = new AWS.SNS()
        console.log("sended to", phoneNum )
        let params = {
            Subject: 'Verificación Criptopagos',
            Message: msg,
            MessageStructure: 'string',
            PhoneNumber: phoneNum
        }

        return sns.publish(params, (err, data) => {})
    },
    generateMerchandID: () => {
        let merchandID = ""
        for (let i = 0; i < 8; i++) {
            merchandID += ~~(Math.random() * 10)
        }
        return merchandID
    },
    generateAccountID: () => {
        return util.generateMerchandID()
    },
    getFileTemplate: (filename, data) => {
        let html = fs.readFileSync(path.resolve(__dirname + '/view/', filename),
            'utf8')

        const template = handlebars.compile(html)

        return template(data)
    },
    arrayContains: (container, element) => {
        return container.indexOf(element) > -1;
    }
}

util.CustomError.prototype = Object.create(Error.prototype)
util.CustomError.prototype.constructor = util.CustomError


module.exports = util