const request = require('request')
const data = require('./test.data.js')


requestJson = ( action, json, statusCode, done ) => {
    request( {
        uri:    'http://localhost:3000/api/test/' + action,
        method: 'POST',
        json: json
    },
    function( error, response, body ) {
        expect(response.statusCode).toBe(statusCode)
        done()
    })
}


describe("Testing Accounts signup", function() {

    it("Should return success with complete data", function(done) {
        requestJson('signup', data.success3(), 200, done )
    })
    it("Should return error with no phone", function(done) {
        requestJson('signup', data.error4( "phone" ), 422, done )
    })
    it("Should return error with no email", function(done) {
        requestJson('signup', data.error4( "email" ), 422, done )
    })
    it("Should return error with no name", function(done) {
        requestJson('signup', data.error4( "name" ), 422, done )
    })
    it("Should return error with no document type", function(done) {
        requestJson('signup', data.error4( "document_type" ), 422, done )
    })
    it("Should return error with no document number", function(done) {
        requestJson('signup', data.error4( "document_number" ), 422, done )
    })
    it("Should return error with no type", function(done) {
        requestJson('signup', data.error4( "type" ), 422, done )
    })
    it("Should return error with existing phone", function(done) {
        requestJson('signup', data.error5(), 422, done )
    })
    it("Should return error with existing email", function(done) {
        requestJson('signup', data.error6(), 422, done )
    })
    it("Should return error with no valid value for document type", function(done) {
        requestJson('signup', data.error7( "document_type" ), 422, done )
    })
    it("Should return error with no valid value for type", function(done) {
        requestJson('signup', data.error7( "type" ), 422, done )
    })
})

describe("Testing Accounts signin", function() {
    
    it("Should return success with phone", function(done) {
        requestJson('signin', data.success1, 200, done )
    })

    it("Should return success with email", function(done) {
        requestJson('signin', data.success2, 200, done )
    })

    it("Should return error with no email or phone", function(done) {
        requestJson('signin', data.error1, 422, done )
    })

    it("Should return error with no password", function(done) {
        requestJson('signin', data.error2, 422, done )
        requestJson('signin', data.error3, 422, done )
    })
    it("Should return error with wrong or malformed input", function(done) {
        requestJson('signin', data.malformed1, 422, done )
        requestJson('signin', data.malformed1, 422, done )
        requestJson('signin', data.malformed1, 422, done )
        requestJson('signin', data.malformed1, 422, done )
        requestJson('signin', data.empty, 422, done )
    })
})
