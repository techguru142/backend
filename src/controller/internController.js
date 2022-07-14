const internModel = require("../Models/internModels");
const collegeModel = require("../Models/collegeModels");
const validator = require("validator");

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false; //Here it Checks that Is there value is null or undefined
  if (typeof value === "string" && value.trim().length === 0) return false; // Here it Checks that Value contain only Space
  return true;
};
const isValidBody = function (body) {
  return Object.keys(body).length > 0;
};

const createIntern = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin','*')
  try {
    let requestBody = req.body;
    //-----------------------------VALIDATION START-----------------------------------//
    if (!isValidBody(requestBody))
      return res
        .status(400)
        .send({ status: false, msg: "Please provide intern details" });
    //extracting body keys
    const { name, email, mobile, collegeName, isDeleted } = requestBody;
    //for valid name
    if (!isValid(name))
      return res
        .status(400)
        .send({ status: false, message: "Please provide name" });

    if (/^[a-zA-Z_]+[\s][a-zA-Z]+$/.test(name) == false)
      return res.status(400).send({
        status: false,
        message: "Please provide only Alphabets in name",
      });

    //-------------------------valid email & unique e-mail-----------------------------//

    if (!isValid(email))
      return res
        .status(400)
        .send({ status: false, message: "Please provide email" });

    if (validator.isEmail(email) === false)
      return res.status(400).send({
        status: false,
        message: `Email should be a valid email address`,
      });
    const isEmailAlreadyUsed = await internModel.findOne({ email });
    if (isEmailAlreadyUsed)
      return res.status(400).send({
        status: false,
        message: `${email} email is already registered`,
      });
    /*--------------------------------------------------------------------------------*/
    //------------------------valid & unique mobile--------------------------------//
    if (!isValid(mobile))
      return res
        .status(400)
        .send({ status: false, message: "Please provide mobile number" });

    if (!/^[789][0-9]{9}$/.test(mobile)) {
      return res.status(400).send({
        status: false,
        msg: `${mobile} is not a valid mobile number(start with 7,8,9) or ${
          String(mobile).length
        } is not allowed`,
      });
    }

    const isNumberAlreadyUsed = await internModel.findOne({ mobile });
    if (isNumberAlreadyUsed)
      return res.status(400).send({
        status: false,
        message: `${mobile} number is already registered`,
      });
    /*--------------------------------------------------------------------------------*/

    if (!isValid(collegeName))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid collegeName." });
    if(requestBody.hasOwnProperty("isDeleted")){
    if (typeof isDeleted !== "boolean")
      return res.status(400).send({
        status: false,
        msg: "isDeleted type must be Boolean",
      });
    if (isDeleted == true)
      return res.status(400).send({
        status: false,
        msg: "You can't delete data before creation",
      });
    }

    //-------------------------VALIDATION ENDS-------------------------------//

    //checking college name by finding in college collection
    let CollegeID = req.body.collegeName;
    let collegeData = await collegeModel.findOne({ name: CollegeID });
    console.log(collegeData);
    if (!collegeData)
      return res.status(400).send({
        status: false,
        message: `${CollegeID} is not a valid college name `,
      });

    const validCollegeID = collegeData._id;

    //collection all the data and storing it in a varibale
    const internData = {
      isDeleted: false,
      name,
      email,
      mobile,
      collegeId: validCollegeID,
    };

    await internModel.create(internData);
    return res.status(201).send({
      status: true,
      message: `Intern created successfully`,
      data: internData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createIntern = createIntern;
/*-------------------------------------------------GET API------------------------------------------------*/

const getCollegeDetails = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin','*')
  try {
    let queryData = req.query;
    let name = queryData.collegeName;
    if (Object.keys(queryData).length > 1) {
      return res
        .status(400)
        .send({ status: false, msg: "Only collegeName is acceptable" });
    }
    if (Object.keys(queryData).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter valid data in query" });
    }
    if (!queryData.collegeName) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Oops! key have empty space or invalid name",
        });
    }
    //************************DB CALL************************//
    let collegeData = await collegeModel
      .findOne({ name: name })
      .select({ name: 1, fullName: 1, logoLink: 1});
    if (!collegeData)
      return res
        .status(404)
        .send({ status: false, msg: "Oops! data not found" }); // if wrong entry
    let collegeId = collegeData._id.valueOf();
    let internData = await internModel
      .find({ collegeId: collegeId })
      .select({ collegeId: 0, __v: 0, isDeleted: 0 });
    if (internData.length == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "Sorry! no intern for this college" });
    }
    //********************** Destructuring********************************/
    let data = {
      name: collegeData.name,
      fullName: collegeData.fullName,
      logoLink: collegeData.logoLink,
      isDeleted: collegeData.isDeleted,
      intern: internData,
    };
    res.status(200).send({ data: data });
  } catch (err) {
    res.status(500).send({ status: false, Error: err.message });
  }
};

module.exports.getCollegeDetails = getCollegeDetails;
