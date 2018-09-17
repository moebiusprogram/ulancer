const mongoose  = require('mongoose')
const passport  = require('passport')
const postCtrl  = require('../controllers/posts.controller')
const router    = require('express').Router()
const Posts = mongoose.model('Posts')
const Users = mongoose.model('Users')
const jwt   = require('express-jwt')
const auth  = require( './utils' )



router.post('/:username/', auth.required, postCtrl.create )
router.get('/:username/', auth.required, postCtrl.findAll )
router.get('/:username/:post', auth.required, postCtrl.find )
router.put('/:username/:post', auth.required, postCtrl.update )
router.delete('/:username/:post', auth.required, postCtrl.delete )


module.exports = router
