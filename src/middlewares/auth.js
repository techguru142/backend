const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;

const checkAuth = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, message: "token must be present" })

try{
    decodedToken = jwt.verify(token, 'project-bookManagement')
    console.log(decodedToken)
  }catch(error){
    return res.status(401).send({ status: false, message: "token is Invalid ...." })
  }


    next()
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message })
  }
}

const Authorization = async function (req, res, next) {
  try {
    let { userId } = req.body
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, message: "token must be present" })

    try {
      decodedToken = jwt.verify(token, 'project-bookManagement')
    } catch (err) {
      return res.status(401).send({ status: false, message: "token is not valid" })
    }

    //let decodedToken = jwt.verify(token, 'project-bookManagement')
    //if (!decodedToken) return res.status(401).send({ status: false, message: "token is not valid" })

    if (!req.body.hasOwnProperty("userId")) {
      bookId = req.params.bookId
      if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is invalid in url!!!!" })
      let user = await bookModel.findById(bookId)
      if (!user) return res.status(400).send({ status: false, message: "Book Id is invalid in url!!!!" })
      userId = user.userId

    }
    if (userId != decodedToken.userId) {
      return res.status(403).send({ status: false, message: "You are not authorized to Do this Task ..." })
    }

    next()
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message })
  }
}




module.exports.checkAuth = checkAuth;
module.exports.Authorization = Authorization;