/* beautify preserve:start */
const mongoose   = require('mongoose')
const { Schema } = mongoose
/* beautify preserve:end */

const ProfileSchema = new Schema( {
    accountID: {type: String, required: true },
    motto: {type: String},
    bio: {type: String},
} )
//ProfileSchema.plugin( uniqueValidator )


exports.Profile = mongoose.model( 'Profile', ProfileSchema )
