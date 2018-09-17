const mongoose  = require('mongoose')
const Posts = mongoose.model('Posts')
const Users = mongoose.model('Users')
const jwt   = require('express-jwt')

exports.create = (req, res) => {

    const { payload: { username } } = req;
    
    if( username != req.params.username ) {
        return res.status(400).send({ error: "User is not authorized to view this posts"})
    }
    
    if(!req.body.title) {
        return res.status(400).send({ error: "Post title can not be empty"})
    }

    if(!req.body.image) {
        return res.status(400).send({ error: "Post image can not be empty"})
    }

    const post = new Posts({
        title: req.body.title,
        image: req.body.image,
        description: req.body.description || "",
        author: req.payload.id
    })

    post.save()
    .then(data => {
        res.send({ message: "Post created successfully"})
    }).catch(err => {
        res.status(400).send({ error: "Error creating post"
        })
    })
}

exports.findAll = (req, res, next) => {
    
    const { payload: { username } } = req;
    
    if( username != req.params.username ) {
        return res.status(400).send({ error: "User is not authorized to view this posts"})
    }
    
    Posts.find( { author: req.payload.id } )
    .then( posts => {
        if( posts.length > 0 ) {
            res.send(posts)
        } else {
            res.send({ message: "No post found for this user"})
        }
    }).catch(err => {
        res.status(400).send({ error: "Error retrieving posts"})
    })
}

exports.find = (req, res) => {

    const { payload: { username } } = req;
    
    if( username != req.params.username ) {
        return res.status(400).send({ error: "User is not authorized to view this posts"})
    }

    var id = null
    
    if( mongoose.Types.ObjectId.isValid(req.params.post) ) {
        id = req.params.post
    }
    
    Posts.find({ 
        $and: [
            {$or: [ {_id: id},{title: req.params.post} ]},
            { author: req.payload.id }
        ]}, (err, post) => {
        if( err != null ){
            res.status(400).send({ error: "Error retrieving post:" + err})
        }else if(post.length){
            res.send(post)
        } else {
            res.status(400).send({ error: "No post found"})
        }
    })
}

exports.update = (req, res) => {

    const { payload: { username } } = req;
    
    if( username != req.params.username ) {
        return res.status(400).send({ error: "User is not authorized to view this posts"})
    }
    
    if( !req.body.title && !req.body.image && !req.body.description ) {
        return res.status(400).send({ error: "No changes in the post"})
    }

    var id = null
    
    if( mongoose.Types.ObjectId.isValid(req.params.post) ) {
        id = req.params.post
    }

    Posts.findOneAndUpdate({ 
        $and: [
            {$or: [ {_id: id},{title: req.params.post} ]},
            { author: req.payload.id }
        ]}, req.body , {new: true}, ( err, post ) => {
        if(err){
            if(err.code == 11000) {
                return res.status(400).send(
                { error: "Error updating post. Title already exists" })
            } else {
                return res.status(400).send({ error: "Error updating post" })
            }
        }
        if (post){
            return res.send(post)
        }else{
            return res.status(400).send({ error: "No post found"})
        }
    })
}

exports.delete = (req, res) => {

    const { payload: { username } } = req;
    
    if( username != req.params.username ) {
        return res.status(400).send({ error: "User is not authorized to view this posts"})
    }

    var id = null
    
    if( mongoose.Types.ObjectId.isValid(req.params.post) ) {
        id = req.params.post
    }
    
    Posts.findOneAndDelete({ 
        $and: [
            {$or: [ {_id: id},{title: req.params.post} ]},
            { author: req.payload.id }
        ]}, (err, post) => {
        if (post){
            res.send({ message: "Post deleted successfully"})
        }else{
            res.status(400).send({ error: "Error deleting post. Post does not exist"})
        }
    })
}

