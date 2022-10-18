const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")

const { isValid, isValidName, isValidEmail, isValidPassword, isValidTitle } = require('../controllers/validattor')


const createAuthor = async function (req, res) {

  try {

    let { fname, lname, title, email, password } = req.body

    if (Object.keys(req.body).length < 1) return res.status(400).send({
      status: false,
      message: "Insert data "
    })

    if (!isValid(fname)) {
      return res.status(400).send({ status: false, message: "Enter fname" })

    }

    if (!isValidName(fname)) {
      return res.status(400).send({ status: false, message: "Enter valid fname" })
    }

    if (!isValid(lname)) {
      return res.status(400).send({ status: false, message: "Enter lname" })

    }

    if (!isValidName(lname)) {
      return res.status(400).send({ status: false, message: "Enter valid lname" })
    }

    if (!isValid(title)) {
      return res.status(400).send({ status: false, message: " Title is required" })
    }

    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, message: "Enter valid title from this[Mr,Mrs,Miss]" })
    }

    if (!isValid(email)) {
      return res.status(400).send({ status: false, message: "Email is required" })
    }

    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Enter valid email" })

    }

    let checkEmail = await authorModel.findOne({ email: email })
    if (checkEmail) return res.status(400).send({
      status: false,
      message: "This email already exists"
    })

    if (!isValid(password)) {
      return res.status(400).send({ status: false, message: "Password is required" })
    }

    //checking for valid password length
    if (!isValidPassword(password)) {
      return res.status(400).send({ status: false, message: "Password length should be between 8 to 15" })
    }

    let createAuthor = await authorModel.create(req.body)

    return res.status(201).send({
      status: true,
      message: 'Success',
      data: createAuthor
    })

  }

  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}


const loginAuthor = async function (req, res) {
  try {
    let email = req.body.email
    let password = req.body.password

    let author = await authorModel.findOne({ email: email, password: password })
    if (!author) { return res.send("Please use correct email or password") }
    let token = jwt.sign(
      {
        authorId: author._id.toString()
      },
      "project-blog"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, data: { token: token } });
  }

  catch (err) {
    return res.status(500).send({ msg: "Error", Error: err.message })
  }
};





module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor
