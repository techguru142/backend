const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId;
const moment=require("moment")




const addReview = async (req, res) => {
    let { bookId } = req.params
    let { reviewedBy, reviewedAt, rating, review } = req.body
    let regEx=/^[A-Za-z -.]+$/

    if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

    let findBook = await bookModel.findOne({ bookId: bookId, isDeleted: false })
    if (!findBook) return res.status(404).send({ status: false, message: "No such Book is Present as Per BookID" })
    if(!reviewedAt) return res.status(400).send({status:false,message:"reviewedAt date is Missing"})

    if(reviewedBy &&  (reviewedBy==="") || !(regEx.test(reviewedBy))) return res.status(400).send({status:false,message:"invalid Value in reviewed BY!!!"})

    if(!moment(reviewedAt,"YYYY-MM-DD",true).isValid) return res.status(400).send({status:false,message:false})
    var d = moment("2016-10-19").format(dateFormat);


    req.body.bookId = bookId.toString()
    let reviewDate = await reviewModel.create(req.body)
    await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } })
    return res.status(201).send({ status: true, data: reviewDate })



}

module.exports.addReview = addReview