const express = require('express');
const router = express.Router();
const middlewares = require("../middlewares/validator")
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/authors', authorController.createAuthor)
router.post('/login', authorController.loginAuthor)
router.post('/blogs',middlewares.checkAuth, blogController.createBlog)
router.get('/blogs',middlewares.checkAuth, blogController.getBlogData)
router.put('/blogs/:blogId',middlewares.checkAuth, blogController.updateBlog)
router.delete('/blogs/:blogId',middlewares.checkAuth, blogController.deleteByParams)
router.delete('/blogs',middlewares.checkAuth, blogController.deleteByQueryParams)



module.exports = router;