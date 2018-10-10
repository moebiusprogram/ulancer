const express   = require('express')
const path      = require('path')
const favicon   = require('serve-favicon')
const logger    = require('morgan')
const cors      = require('cors')
const mongoose  = require('mongoose')
const passport  = require('passport')
const cookieParser  = require('cookie-parser')
const bodyParser    = require('body-parser')
const databaseConf    = require('./config/remote.config.js')
//const databaseConf  = require('./config/database.config.js')
const constants     = require('./config/constants.config')

mongoose.Promise = global.Promise

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect(databaseConf.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to database")
}).catch(err => {
    console.log('Error connecting with db: ', err )
    process.exit()
})
mongoose.set('debug', true)

require('./models/accounts.model')

const accountsRoutes = require('./routes/accounts.route')

app.use("/", accountsRoutes)
    
module.exports = app
