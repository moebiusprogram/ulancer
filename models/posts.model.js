const mongoose = require('mongoose')
const { Schema } = mongoose


const PostsSchema = new Schema({
    title: { type : String , required : true },
    image: { type : String , required : true },
    description: { type : String, default: ""},
    author: { type : String }
})

mongoose.model('Posts', PostsSchema)
