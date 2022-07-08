const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId;




const isValid = function (value) {
    if (typeof value == null) return false; //Here it Checks that Is there value is null or undefined  " " 
    if (typeof value === "string" && value.trim().length === 0) return false; // Here it Checks that Value contain only Space
    return true;
};
let alphaRegex = /^[A-Za-z -.]+$/

const addReview = async (req, res) => {
    try {
        let { bookId } = req.params
        let { reviewedBy, reviewedAt, rating, review } = req.body

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Body Can't be Empty " })
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
        let updatedBook = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true }).lean()
        updatedBook.reviewDate = reviewDate
        return res.status(201).send({ status: true, message: "Success", data: updatedBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        let bookId = req.params.bookId;

        //bookId validation
        if (!bookId) return res.status(400).send({ status: false, message: "Please give book id" });
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        //bookId exist in our database
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false }); //check id exist in book model
        if (!findBook) return res.status(404).send({ status: false, message: "BookId dont exist" });

        //review-
        let reviewId = req.params.reviewId;
        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "Review Id is Invalid !!!!" })

        const findReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false, }); //check id exist in review model
        if (!findReview) return res.status(404).send({ status: false, message: `reviewId dont exist or this reviews is not for " ${book.title} " book`, });

        const deleteReview = await reviewModel.findByIdAndUpdate(
            { _id: reviewId, bookId: bookId, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
        await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } })
        return res.status(200).send({ status: true, message: "Successfully deleted review", data: deleteReview, });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const updatedReviewById = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId;
        let { review, rating, name } = req.body

        //bookId validation
        if (!bookId) return res.status(400).send({ status: false, message: "Please give book id" });
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        //bookId exist in our database
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false }); //check id exist in book model
        if (!findBook) return res.status(404).send({ status: false, message: "BookId dont exist" });

        //review-
        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "Review Id is Invalid !!!!" })

        const findReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false, }); //check id exist in review model
        if (!findReview) return res.status(404).send({ status: false, message: `reviewId dont exist or this reviews is not for " ${book.title} " book`, });

        const updateReview = await reviewModel.findByIdAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, req.body, { new: true });
        return res.status(200).send({ status: true, message: "Successfully Update review", data: updateReview, });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
module.exports.addReview = addReview
module.exports.deleteReview = deleteReview
module.exports.updatedReviewById = updatedReviewById