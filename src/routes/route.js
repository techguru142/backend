const express = require("express")
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const authMW = require("../middlewares/auth")

const router = express.Router()

router.post("/register", userController.createUser);
router.post('/login', userController.loginUser);

router.post('/books', authMW.checkAuth, authMW.Authorization, bookController.createBook);

router.get('/books', authMW.checkAuth, bookController.getBooks);







module.exports = router