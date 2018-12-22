/* beautify preserve:start */
const mongoose   = require('mongoose')
const { Schema } = mongoose
/* beautify preserve:end */

const CoursesSchema = new Schema( {
    name: {type: String, required: true, unique: true },
    teacher: {type: String, required: true, unique: true },
    image: {type: String, required: true, unique: true },
    score: {type: String },
    students: {type: Number },
    wishes: {type: Number }
} )

exports.Courses = mongoose.model( 'Courses', CoursesSchema )
