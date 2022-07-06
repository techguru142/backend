 const express = require("express")
 const userController = require("../controllers/userController") 
 const bookController=require("../controllers/bookController")

const router = express.Router()

router.post("/register" , userController.createUser) ;
router.post('/login', userController.loginUser);
router.post('/books', bookController.createBook);







module.exports = router