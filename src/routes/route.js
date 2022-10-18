const express = require('express');
const router = express.Router();
const middlewares = require("../middlewares/checkAuth")
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")

// router.get("/test-me", function (req, res) {
//     res.send("My first ever api!")
// })

router.post('/authors', authorController.createAuthor)
router.post('/login', authorController.loginAuthor)
router.post('/blogs',middlewares.Auth,blogController.createBlog)
router.get('/blogs',middlewares.Auth,blogController.getBlogData)
 router.put('/blogs/:blogId', middlewares.Auth,blogController.updateBlog)
 router.delete('/blogs/:blogId', middlewares.Auth,blogController.deleteByParams)
router.delete('/blogs',middlewares.Auth,blogController.deleteByQueryParams)



module.exports = router;