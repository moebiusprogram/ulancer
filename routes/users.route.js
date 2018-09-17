const usersCtrl = require('../controllers/users.controller')
const router    = require('express').Router()
const auth  = require( './utils' )

//Register
router.post('/register', auth.optional, usersCtrl.register)

//Login
router.post('/login', auth.optional, usersCtrl.login)

//Debug Route 
router.get( '/list',auth.optional, usersCtrl.list )

module.exports = router
