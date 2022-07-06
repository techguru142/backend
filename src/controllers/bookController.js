const BookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const ObjectId = require('mongoose').Types.ObjectId;

const validateField = /^[a-zA-Z0-9\s\-,?_.]+$/;

const createBook = async (req, res) => {
    try {
        const data = req.body;
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt } = data;
        //check for empty body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please enter some DETAILS!!!" });
        }

        //title
        if (!title) {
            return res.status(400).send({ status: false, message: "TITLE is required!!!" });
        }
        if (!validateField(title)) {
            return res.status(400).send({ status: false, message: "format of title is wrong!!!" });
        }
        let findTitle = await BookModel.findOne({ title: title });
        if (findTitle) {
            return res.status(400).send({ status: false, message: "title already exist" });
        }


        if (!excerpt) {
            return res.status(400).send({ status: false, message: "EXCERPT is required!!!" });
        }

    
        //check the User Id is Valid or Not ?
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "UserId is Invalid" });
        }
        let findUserID = await userModel.findById(userId);
        if (!findUserID) {
            return res.status(400).send({ status: false, message: "User Not Present in DB as per UserID" });
        }


        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is required!!!" });
        }
        let validateISBN = /^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/;
        if (!validateISBN.test(data.ISBN)) {
            return res.status(400).send({ status: false, message: "enter valid ISBN number" });
        }
        let findUserISBN = await userModel.findOne({ISBN:ISBN});
        if (findUserISBN) {
            return res.status(400).send({ status: false, message: "ISBN already exist" });
        }

       
        if (!category) {
            return res.status(400).send({ status: false, message: "CATEGORY is required!!!" });
        }
        if (!subcategory) {
            return res.status(400).send({ status: false, message: "SUBCATEGORY is type is invalid!!!" });
        }

        //releasedAt
        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "RELEASED DATE is required!!!" });
        }
        
        let validateDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/gm;
        if (!validateDate.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "date must be in format  YYYY-MM-DD!!!", });
        }

        const book = await BookModel.create(data);
        return res.status(201).send({ status: true, message: "Book created successfully", data: book });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
module.exports.createBook = createBook;