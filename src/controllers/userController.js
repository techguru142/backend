const emailValidator = require("email-validator")
const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')

const validName = /^[a-zA-Z]+/
const validPhoneNumber = /^[0]?[6789]\d{9}$/
let validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

const isValid = function (value) {
    if (typeof value == "undefined" || typeof value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

const createUser = async function (req, res) {
    try {
        let userData = req.body;
        const { title, name, phone, email, password, address, ...rest } = userData;

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attributes in request Body" })
        if (Object.keys(userData).length == 0) return res.status(400).send({ status: false, message: "Require-Body Mandatory" })
        if (!title) return res.status(400).send({ status: false, message: "title is  Mandatory" })
        if (!(["Mr", "Mrs", "Miss"].includes(title))) return res.status(400).send({ status: false, message: "title should be Mr Mrs Miss" })
        if (!name) return res.status(400).send({ status: false, message: "name is  Mandatory" })
        if (!phone) return res.status(400).send({ status: false, message: "phoneNumber is  Mandatory" })
        if (!email) return res.status(400).send({ status: false, message: "email is  Mandatory" })
        if (!password) return res.status(400).send({ status: false, message: "password is  Mandatory" })

        if (!validName.test(name)) return res.status(400).send({ status: false, message: "name is Invalid" })
        if (!validPhoneNumber.test(phone)) return res.status(400).send({ status: false, message: "phoneNumber is incorrect" })
        if (!emailValidator.validate(email)) return res.status(400).send({ status: false, message: "Provide email in correct format  " })
        if (!validPassword.test(password)) return res.status(400).send({ status: false, message: "password must have atleast 1digit , 1uppercase , 1lowercase , special symbols(@$!%*?&) and between 8-15 range, ex:Nitin@123" })

        if (req.body.hasOwnProperty("address")) {

            if (typeof address !== "object") { return res.status(400).send({ status: false, message: "address is invalid type" }) }
            if (Object.keys(address).length == 0) return res.status(400).send({ status: false, message: "address must have atleast one Field" })

            const { street, city, pincode, ...rest } = req.body.address
            if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attributes in address Field" })
            if (req.body.address.hasOwnProperty("street")) {
                if (!isValid(address.street)) return res.status(400).send({ status: false, message: "street name is Invalid" })
            }
            if (req.body.address.hasOwnProperty("city")) {
                if (!isValid(address.city)) return res.status(400).send({ status: false, message: "city name is Invalid" })
            }
            if (req.body.address.hasOwnProperty("pincode")) {
                if (isNaN(address.pincode)) return res.status(400).send({ status: false, message: "pincode should be a number" })
                if (address.pincode.length !== 6) return res.status(400).send({ status: false, message: "pincode should be six digit only" })
            }
        }

        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) return res.status(400).send({ status: false, message: "Email already exist" })

        let uniquePhone = await userModel.findOne({ phone: phone })
        if (uniquePhone) return res.status(400).send({ status: false, message: "Phone Number already exist" })

        let data = await (await userModel.create(userData))

        return res.status(201).send({ status: true, message: 'Success', data: data })
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

const loginUser = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password

        if (Object.keys(req.body).length === 0) { return res.status(400).send({ status: false, message: "Please provide Email and Password details" }) }
        if (!email) return res.status(400).send({ status: false, message: "email is  Mandatory" })
        if (!password) return res.status(400).send({ status: false, message: "password is  Mandatory" })

        let userData = await userModel.findOne({ email: email, password: password })
        if (!userData) { return res.status(400).send({ status: false, message: "Please use correct email or password" }) }
        let token = jwt.sign(
            {
                userId: userData._id.toString(),
                batch: "radon",
                organisation: "FunctionUp",
                exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
            },
            "project-bookManagement"
        );
        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Success", data: { token } });
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
};

module.exports.createUser = createUser
module.exports.loginUser = loginUser