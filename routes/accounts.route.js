const accountsCtrl = require('../controllers/accounts.controller')
const router    = require('express').Router()
const utils  = require( '../utils' )

require('../config/passport.config')

/** API Routes **/

//Register
router.post('/api/v1/signup', accountsCtrl.signup)

//Login
router.post('/api/v1/signin', accountsCtrl.signin)

//List
router.get('/api/v1/list', accountsCtrl.list  )

router.get('/api/v1/gettoken', accountsCtrl.getToken  )

router.get('/api/v1/verifytoken', accountsCtrl.verifyToken  )

//Auth
//router.get('/api/v1/auth', utils.required, accountsCtrl.list  )


/** Testing Routes **/

//List
router.get('/api/test/list', accountsCtrl.list  )

//Login
router.post('/api/test/signin', accountsCtrl.signin)

//Register
router.post('/api/test/signup', accountsCtrl.signup)

//Auth
//router.get('/api/test/auth', utils.required, accountsCtrl.list  )

//Delete db
router.get('/api/test/cleardb', accountsCtrl.cleardb  )

router.get('/api/v1/profile', utils.authRequired, accountsCtrl.getProfile  )

router.post('/api/v1/profile/save', utils.authRequired, accountsCtrl.saveProfile  )

router.get('/api/v1/courses', accountsCtrl.getCourses  )

module.exports = router
