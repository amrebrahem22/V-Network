const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const auth = require('../middlewares/auth')

router.route('/posts')
    .post(auth, postCtrl.createPost)
    .get(auth, postCtrl.getPosts)


module.exports = router