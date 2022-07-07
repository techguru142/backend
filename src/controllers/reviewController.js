const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId;
<<<<<<< HEAD
// const moment = require("moment")
=======
//const moment = require("moment")
>>>>>>> 0395a5254f762a3aa2a09873eacca1524a51bb95



const isValid = function (value) {
    if (typeof value == null) return false; //Here it Checks that Is there value is null or undefined
    if (typeof value === "string" && value.trim().length === 0) return false; // Here it Checks that Value contain only Space
    return true;
};
let alphaRegex = /^[A-Za-z -.]+$/

const addReview = async (req, res) => {
    let { bookId } = req.params
    let { reviewedBy, reviewedAt, rating, review } = req.body

    if(Object.keys(req.body).length==0) return res.status(400).send({ status: false, message: "Body Can't be Empty " })
    if (!reviewedAt) return res.status(400).send({ status: false, message: "reviewedAt date is Missing" })
    if (!rating) return res.status(400).send({ status: false, message: "rating is Missing" })

    if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

    let findBook = await bookModel.findOne({ bookId: bookId, isDeleted: false })
    if (!findBook) return res.status(404).send({ status: false, message: "No such Book is Present as Per BookID" })
    
    if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: " Plz enter Valid reviewedBY" })
    if (!alphaRegex.test(reviewedBy)) return res.status(400).send({ status: false, message: "oops! reviewedBY can not be a number" })

    validDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
    if (!validDate.test(reviewedAt)) return res.status(400).send({ status: false, message: " Plz enter Valid Date as YYYY-MM-DD" })

    if (!(rating >= 1 && rating <= 5)) return res.status(400).send({ status: false, message: " Plz enter Rating between [1-5]" })


    req.body.bookId = bookId.toString()
    let reviewDate = await reviewModel.create(req.body)
    let updatedBook= await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } })
    return res.status(201).send({ status: true,message:"Success", data: updatedBook })



}

module.exports.addReview = addReview