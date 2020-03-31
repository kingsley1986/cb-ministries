const mongoose = require('mongoose')
const postImageBasePath = 'uploads/postImages'
const path = require('path')
 const postSchema = new mongoose.Schema({
    title: {
         type: String,
         required: true
    },
    description: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now
    },
    postImage: {
        type: String,
        require: true
    }
 })

postSchema.virtual('coverImagePath').get(function() {
    if(this.postImage != null) {
        return path.join('/', postImageBasePath, this.postImage)
    }
})

 module.exports = mongoose.model('Post', postSchema)
 module.exports.postImageBasePath = postImageBasePath