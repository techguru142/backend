const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId;


const addReview = async (req, res) => {
    let { bookId } = req.params
    let { reviewedBy, reviewedAt, rating, review } = req.body

    if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

    let findBook = await bookModel.findOne({ bookId: bookId, isDeleted: false })
    if (!findBook) return res.status(404).send({ status: false, message: "No such Book is Present as Per BookID" })

   
   // if(reviewedBy && reviewedBy.length==0) return res.status(400).send({ status: false, message: " Plz enter Valid reviewedBY" })
    // if (reviewedBy && typeof (reviewedBy) !== "string") return res.status(400).send({ status: false, message: " Plz enter Valid reviewedBY" })
    //if (reviewedBy && (!reviewedBy.trim())) return res.status(400).send({ status: false, message: " Plz enter Valid reviewedBY" })

    req.body.bookId = bookId.toString()
    let reviewDate = await reviewModel.create(req.body)
    await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } })
    return res.status(201).send({ status: true, data: reviewDate })



}

module.exports.addReview = addReview