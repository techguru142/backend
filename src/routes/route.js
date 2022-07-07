const express = require("express")
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController=require("../controllers/reviewController")
const authMW = require("../middlewares/auth")

const router = express.Router()

router.post("/register", userController.createUser);

router.post('/login', userController.loginUser);

router.post('/books', bookController.createBook);

router.get('/books',  bookController.getBooks);

router.get('/books/:bookId',bookController.getBooksById)

router.put('/books/:bookId',bookController.updateBookbyId)

router.post("/books/:bookId/review",reviewController.addReview)

router.delete('/books/:bookId', bookController.deleteBookById)

router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)







module.exports = router