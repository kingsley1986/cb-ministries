const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const fs = require('fs')
const multer  = require('multer')
const path =  require('path')
const uploadPath = path.join('public', Post.postImageBasePath)
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({ 
  dest: uploadPath,
  fileFilter:  (req, file, callback) => {
    callback(null, imageMineTypes.includes(file.mimetype) )
  }
})

// Get all Blog posts
router.get('/', async (req, res) => {
  try {
    const posts =  await Post.find({})
    res.render('posts/index', {
      posts: posts
    });
  } catch {
    res.redirect('/')
  }
});

// New blogpost routes
router.get('/new', async (req, res, next) => {
  renderNewPage(res, new Post())
});

// Create blogpost routes
router.post('/', upload.single('cover'), async (req, res, next) => {
 const fileName = req.file != null ? req.file.filename : null

  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    from: req.body.from,
    postImage: fileName

  })
  try {
    const newPost = await post.save()
    res.redirect('/posts')

  } catch {
    console.log("hello her eis it")
    if (post.postImage != null) {
      removePostImage(post.postImage)
    }
    renderNewPage(res, post, true)
  }
});

function removePostImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err =>  {
    if (err) console.log(err)
  })
}

async function renderNewPage(res, post, hasError = false) {
  try {
    const params = {
      post: post
    }
    if (hasError) params.errorMessage = 'Error Creating Post'
    res.render('posts/new', params)
  } catch {
    res.redirect('/posts')
  }
}
  
module.exports = router;
