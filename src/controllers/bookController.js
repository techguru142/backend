const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel")
const ObjectId = require('mongoose').Types.ObjectId;

let validateISBN = /(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)/;
let validateDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
const validateField = /^[a-zA-Z0-9\s\-,?_.]+$/;
const validCategory = /^[a-zA-Z]+/;

//function to check if tag and sub-catogery string is valid or not ?
function check(t) {  ///  "motivation"  ["motivation"]
    let regEx = /^[a-zA-Z]+/;
    if (t) {
        if (!Array.isArray(t)) {
            t = t.toString().split(" ")
            //t=["motivation"]
        }
        for (i of t) {
            if (!regEx.test(i)) {
                return true
            }
        }
    }
}

const createBook = async (req, res) => {
    try {
        const data = req.body;
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt } = data;

        //check for empty body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please enter some DETAILS!!!" });
        if (!title) return res.status(400).send({ status: false, message: "TITLE is required!!!" });
        if (!excerpt) return res.status(400).send({ status: false, message: "EXCERPT is required!!!" });
        if (!userId) return res.status(400).send({ status: false, message: "UserID is required!!!" });
        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is required!!!" });
        if (!category) return res.status(400).send({ status: false, message: "CATEGORY is required!!!" });
        if (!subcategory) return res.status(400).send({ status: false, message: "SUBCATEGORY is type is invalid!!!" });
        if (!releasedAt) return res.status(400).send({ status: false, message: "RELEASED DATE is required!!!" });



        if (!validateField.test(title)) return res.status(400).send({ status: false, message: "format of title is wrong!!!" });
        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, msg: "UserId is Invalid" });
        if (!validateISBN.test(ISBN)) return res.status(400).send({ status: false, message: "enter valid ISBN number" });
        if (!validCategory.test(category)) return res.status(400).send({ status: false, message: "plz enter valid Category" });
        if (!validateDate.test(releasedAt)) return res.status(400).send({ status: false, message: "date must be in format  YYYY-MM-DD!!!", });

        // in this blog of code we are checking that subcategory should be valid, u can't use empty space as subcategory
        if (check(subcategory)) return res.status(400).send({ status: false, msg: "subcategory text is invalid" });


        let findTitle = await bookModel.findOne({ title: title });
        if (findTitle) return res.status(400).send({ status: false, message: "title already exist" });

        let findUserID = await userModel.findById(userId);
        if (!findUserID) return res.status(400).send({ status: false, message: "User Not Present in DB as per UserID" });

        let findUserISBN = await bookModel.findOne({ ISBN: ISBN });
        if (findUserISBN) return res.status(400).send({ status: false, message: "ISBN already exist" });


        const book = await bookModel.create(data);
        return res.status(201).send({ status: true, message: "Book created successfully", data: book });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const getBooks = async (req, res) => {
    try {
        queryData = req.query

        let { userId, category, subcategory, ...rest } = req.query

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, msg: "Invalid filter Keys" });

        if (userId && !ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "UserId is Invalid" });
        }

        queryData.isDeleted = false
        let booksList = await bookModel.find(queryData).sort({ "title": 1 }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        if (booksList.length == 0) {
            return res.status(404).send({ status: false, message: "Data not Found!!!" })
        }
        return res.status(200).send({ status: true, data: booksList })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const getBooksById = async (req, res) => {
    try {
        let bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        booksData = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!booksData) return res.status(404).send({ status: false, message: "No Books Found As per BookID" })

        reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })
        if (!reviewsData) return res.status(404).send({ status: false, message: "No Reviews Found As per BookID" })
        booksData.reviewsData = reviewsData
        return res.status(200).send({ status: true, message: 'Books list', data: booksData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const deleteBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) { return res.status(400).send({ status: false, message: "invalid Book Id" }) }
        let deleteBookData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deleteBookData) { return res.status(404).send({ status: false, message: "No Books Found As per BookID" }) }
        return res.status(200).send({ status: true, message: 'Deleted Books list', data: deleteBookData })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
const updateBookbyId = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        let { title, excerpt, releasedAt, ISBN } = req.body
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please enter some DETAILS!!!" });

        booksData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!booksData) return res.status(404).send({ status: false, message: "No Books Found As per BookID" })

        if (title) {
            if (!validateField.test(title)) return res.status(400).send({ status: false, message: "format of title is wrong!!!" });
            let findTitle = await bookModel.findOne({ title: title })
            if (findTitle) return res.status(400).send({ status: false, message: "title already exist" })

        }

        if (ISBN) {
            if (!validateISBN.test(ISBN)) return res.status(400).send({ status: false, message: "enter valid ISBN number" });
            let findISBN = await bookModel.findOne({ ISBN: ISBN })
            if (findISBN) return res.status(400).send({ status: false, message: "ISBN already exist" })

        }
        if (releasedAt) {
            if (!validateDate.test(releasedAt)) return res.status(400).send({ status: false, message: "date must be in format  YYYY-MM-DD!!!", });
        }
        let updatedBook = await bookModel.findByIdAndUpdate(bookId, req.body, { new: true })
        return res.status(200).send({ status: true, data: updatedBook })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBooksById = getBooksById;
module.exports.deleteBookById = deleteBookById;
module.exports.updateBookbyId = updateBookbyId;
