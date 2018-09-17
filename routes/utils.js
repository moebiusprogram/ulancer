const jwt = require('express-jwt')

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1]
  }
  return null
}

const util = {
  required: jwt({
    secret: 'project number one',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'project number one',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
}

module.exports = util
