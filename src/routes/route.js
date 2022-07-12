const express = require("express")
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController=require("../controllers/reviewController")
const authMW = require("../middlewares/auth")


const router = express.Router()
//Api for Creat New User
router.post("/register", userController.createUser);

router.post('/login', userController.loginUser);

router.post('/books',authMW.checkAuth, bookController.createBook);

router.get('/books', authMW.checkAuth, bookController.getBooks);

router.get('/books/:bookId', authMW.checkAuth, bookController.getBooksById)

router.put('/books/:bookId',authMW.checkAuth,authMW.Authorization, bookController.updateBookbyId)

router.delete('/books/:bookId',authMW.checkAuth,authMW.Authorization, bookController.deleteBookById)

router.post("/books/:bookId/review",reviewController.addReview)

router.put("/books/:bookId/review/:reviewId",reviewController.updatedReviewById)

router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)

router.all("/**",function(req,res){return res.status(404).send({status:false,message:"Requested Api is Not Available"})})







module.exports = router