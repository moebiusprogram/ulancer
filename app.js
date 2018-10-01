const express   = require('express')
const path      = require('path')
const favicon   = require('serve-favicon')
const logger    = require('morgan')
const cors      = require('cors')
const mongoose  = require('mongoose')
const passport  = require('passport')
const cookieParser  = require('cookie-parser')
const bodyParser    = require('body-parser')
//const databaseConf    = require('./config/remote.config.js')
const databaseConf = require('./config/database.config.js')
const LocalStrategy = require('passport-local')

const index = require('./routes/index')

mongoose.Promise = global.Promise

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

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
    console.log('Error connecting with db')
    process.exit()
})
mongoose.set('debug', true)

require('./models/users.model')
require('./models/posts.model')

const usersRoutes = require('./routes/users.route')
const postsRoutes = require('./routes/posts.route')

const Users = mongoose.model('Users')

app.use("/api/users/", usersRoutes)
app.use("/api/posts/", postsRoutes)


passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
},
(username, password, done) => {

  Users.findOne({ username })
    .then((user) => {
      if(!user || !user.validPassword(password)) {
        return done(null, false, { errors: { "username or password": "invalid" } })
      }
      return done(null, user)
    }).catch(done)
}))

app.use('/', index)


module.exports = app
