const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const { default: isBoolean } = require("validator/lib/isBoolean")
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const createBlog = async function (req, res) {
  try {

    let receivedData = req.body
    //title is mandatory
    if (!receivedData.title) { return res.status(400).send({ status: false, msg: "Title is missing" }) }
    //if title is present then please check
    if (receivedData.title) {
      if (receivedData.title.trim().length == 0) return res.status(400).send({ status: false, msg: "Empty space is not allowed" })
      if (!isNaN(receivedData.title)) { return res.status(400).send({ status: false, msg: "Title can not be a number only" }) }
      let titleTrim = /^[^ ][\w\W ]*[^ ]/
      if (!titleTrim.test(receivedData.title)) { return res.status(400).send({ status: false, msg: "Title have white space at begining or end" }) }
    }
    //body is mandatory
    if (!receivedData.body) { return res.status(400).send({ status: false, msg: "body is missing" }) }
    //if body is present then please check
    if (receivedData.body) {
      if (receivedData.body.trim().length == 0) return res.status(400).send({ status: false, msg: "Empty space is not allowed" })
      if (!isNaN(receivedData.body)) { return res.status(400).send({ status: false, msg: "Body can not be a number only" }) }
      let bodyValidation = /^[^ ][\w\W ]*[^ ]/
      if (!bodyValidation.test(receivedData.body)) { return res.status(400).send({ status: false, msg: "body have white space at begining or end" }) }
    }
    //catagory is mandatory
    if (!receivedData.category) { return res.status(400).send({ status: false, msg: "category is missing" }) }

    if (receivedData.category) {
      if (typeof receivedData.category != "object") { return res.status(400).send({ status: false, msg: "Category should be in form of Array of Strings" }) }
      let flag;
      if (typeof receivedData.category === "object") {
        for (let i = 0; i < receivedData.category.length; i++) {
          if (receivedData.category[i].trim().length === 0) {
            flag = "true"
            break;
          }
        }
      }
      if (flag === "true") { return res.status(400).send({ status: false, msg: "Category can't contain empty values" }) }

      for (let i = 0; i < receivedData.category.length; i++) {
        if (!isNaN(receivedData.category[i])) {
          return res.status(400).send({ status: false, msg: "You can't enter only number as Category" })
        }

        if (receivedData.category[i] != receivedData.category[i].trim()) { return res.status(400).send({ status: false, msg: "Category value contains empty spaces at the beginning or end" }) }
    
      }

    }


    if (receivedData.subcategory) {
      if (typeof receivedData.subcategory != "object") { return res.status(400).send({ status: false, msg: "Subcategory should be in form of Array" }) }
      let flag;
      if (typeof receivedData.subcategory === "object") {
        for (let i = 0; i < receivedData.subcategory.length; i++) {
          if (receivedData.subcategory[i].trim().length === 0) {
            flag = "true"
            break;
          }
        }
      }
      if (flag === "true") { return res.status(400).send({ status: false, msg: "Subcategory can't contain empty values" }) }

      for (let i = 0; i < receivedData.subcategory.length; i++) {
        if (!isNaN(receivedData.subcategory[i])) {
          return res.status(400).send({ status: false, msg: "You can't enter only number as sub category" })
        }

        if (receivedData.subcategory[i] != receivedData.subcategory[i].trim()) { return res.status(400).send({ status: false, msg: "Sub category value contains empty spaces at the beginning or end" }) }
    
      }
    }
    if (receivedData.tags) {
      if (typeof receivedData.tags != "object") { return res.status(400).send({ status: "false", msg: "Tags should be in form of Array" }) }
      if (!isNaN(receivedData.tags)) { return res.status(400).send({ status: false, msg: "tags should not be number only" }) }
      let tagValidation = /^#?[a-zA-Z0-9]+/gm
      if (!tagValidation.test(receivedData.tags)) { return res.status(400).send({ status: "false", msg: "Tags can't contain empty values" }) }
      let flag;
      if (tagValidation) {
        for (let i = 0; i < receivedData.tags.length; i++) {
          if (receivedData.tags[i].trim().length === 0) {
            flag = "true"
            break;
          }
        }
      }
      if (flag === "true") { return res.status(400).send({ status: "false", msg: "Tags can't contain empty values after first value" }) }
    }

    if (!isBoolean(receivedData.isDeleted)) { return res.status(400).send({ status: false, msg: "IsDeleted should have only boolean value" }) }
    if (!isNaN(receivedData.isDeleted)) { return res.status(400).send({ status: false, msg: "numbers are not a boolean value except 1 or 0" }) }
    if (!isBoolean(receivedData.isPublished)) { return res.status(400).send({ status: false, msg: "IsPublished should have only boolean value" }) }
    if (!isNaN(receivedData.isPublushed)) { return res.status(400).send({ status: false, msg: "numbers are not a boolean value except 1 or 0" }) }
    //authorId is mandatory
    if (!receivedData.authorId) { return res.status(400).send({ status: false, msg: "author id is missing" }) }
    //author id validation check
    if (receivedData.authorId) {
      let authorid = receivedData.authorId
      if (!mongoose.isValidObjectId(authorid))
        return res.send({ msg: "Enter valid object Id" })
      let authorId = await authorModel.findById({ _id: authorid })
      if (!authorId) { return res.status(400).send("Invalid author id") }
    }
    //once all condition sutisfied successfully then data will be created
    let createdBlogData = await blogModel.create(receivedData)
    res.status(201).send({ status: true, data: createdBlogData })
  }
  catch (err) {
   return res.status(500).send({ msg: "Error", error: err.message })
  }
}

const getBlogData = async function (req, res) {
  try {
  
    // let spaceIn = Object.keys(req.query)
    // if (!spaceIn[00].trim()) { }
    let authorId = req.query.authorId
    if (authorId) {
      let savedAuthorData = await authorModel.findById({ _id: authorId })
      if (!savedAuthorData) return res.status(400).send({ status: false, msg: "invalid author id" })
    }
    let savedBlogData = await blogModel.find({isPublished:true,isDeleted:false,$or: [{tags:req.query.tags},{category:req.query.category},{subcategory:req.query.subcategory},{authorId:req.query.authorId}]})
    // when no one data exits
    if (savedBlogData.length == 0) { return res.status(404).send({ status: false, msg: "Data not founds" }) }
    res.status(200).send({ status: true, data: savedBlogData })
  } catch (err) {
   return res.status(500).send({ msg: "Error", error: err.message })
  }
}

//put Api
const updateBlog = async function (req, res) {
  try {

    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]

    if (!token) return res.status(404).send({ status: false, msg: "Token must be present" })
    let decodedToken = jwt.verify(token, 'project-blog')
    if (!decodedToken) return res.status(400).send({ status: false, msg: "Token is not valid" })

    let id = req.params.blogId
    if (!mongoose.isValidObjectId(id))
      return res.send({ msg: "Enter valid object Id" })
    if (req.params) {
      let blogToBeModified = id

      let IsAvailable = await blogModel.findById(blogToBeModified).select({ authorId: 1, _id: 0 })
      if (!IsAvailable) { return res.status(404).send({ status: false, msg: "No blog with this Id exist" }) }
        let authorLoggedIn = decodedToken.authorId
        if (IsAvailable["authorId"].valueOf() != authorLoggedIn) return res.status(400).send({ status: false, msg: 'Author logged is not allowed to modify the requested users data' })  
    }
    let blog = await blogModel.find({ _id: id, isDeleted: false })
    if (blog.length == 0) {
      return res.status(404).send({ status: false, msg: "Document has been deleted" })
    }

    let title = req.body.title
    let titleValidation = /^[-a-z0-9,\/()&:. ]*[a-z][-a-z0-9,\/()&:. ]*$/i
    if (!titleValidation.test(title)) { return res.status(400).send({ status: false, msg: "Invalid title" }) }

    let body = req.body.body

    let bodyValidation = /^[-a-z0-9,\/()&:. ]*[a-z][-a-z0-9,\/()&:. ]*$/i
    if (!bodyValidation.test(body)) { return res.status(400).send({ status: false, msg: "Invalid body format" }) }

    let tags = req.body.tags

    if (tags) {
      if (typeof tags != "object") { return res.status(400).send({ status: false, msg: "Tags should be in form of Array" }) }
      let flag;
      if (typeof tags === "object") {
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].trim().length === 0) {
            flag = "true"
            break;
          }
        }
      }
      if (flag === "true") { return res.status(400).send({ status: false, msg: "Tags can't contain empty values" }) }

      for (let i = 0; i < tags.length; i++) {
        if (!isNaN(tags[i])) {
          return res.status(400).send({ status: false, msg: "You can't enter only number as Tags" })
        }

        if (tags[i] != tags[i].trim()) { return res.status(400).send({ status: false, msg: "Tags value contains empty spaces at the beginning or end" }) }
    
      }}

    let subcategory = req.body.subcategory

    if (subcategory) {
      if (typeof subcategory != "object") { res.status(400).send({ status: false, msg: "Subcategories should be in form of Array" }) }
      let flag;
      if (typeof subcategory === "object") {
        for (let i = 0; i < subcategory.length; i++) {
          if (subcategory[i].trim().length === 0) {
            flag = "true"
            break;
          }
        }
      }
      if (flag === "true") { return res.status(400).send({ status: false, msg: "Subcategory can't contain empty values" }) }
      for (let i = 0; i < subcategory.length; i++) {
        if (!isNaN(subcategory[i])) {
          return res.status(400).send({ status: false, msg: "You can't enter only number as sub category" })
        }

        if (subcategory[i] != subcategory[i].trim()) { return res.status(400).send({ status: false, msg: "Sub category value contains empty spaces at the beginning or end" }) }
    
      }
    }
    if(req.body.category){return res.status(400).send({status:false,msg:"You are not supposed to update category"})}
    if(req.body.authorId){return res.status(400).send({status:false,msg:"You are not supposed to update authorId"})}
    if(req.body.isDeleted){return res.status(400).send({status:false,msg:"You are not supposed to update isDeleted status"})}
    if(req.body.deletedAt){return res.status(400).send({status:false,msg:"You are not supposed to update Deleted time"})}
    
    let updateData = await blogModel.findOneAndUpdate({ "_id": id }, {
      $set: {
        title: title,
        body: body,
        publishedAt: new Date(),
        isPublished: true
      }
    })

    let updatedData = await blogModel.findOneAndUpdate({ "_id": id },
      { $push: { tags: tags, subcategory: subcategory } }, { new: true })
    res.status(200).send({ status: true, data: updatedData })
  }

  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: "", error: err.message })
  }
}

//Delete api
const deleteByParams = async function (req, res) {
  try {
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, msg: "token must be present" })
    let decodedToken = jwt.verify(token, 'project-blog')
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is not valid" })
    
    let blogId = req.params.blogId
    if (!mongoose.isValidObjectId(blogId)){
      return res.send({ msg: "Enter valid object Id" })
    }
      let blogToBeModified = blogId
      let authorLoggedIn = decodedToken.authorId
      //finding Author id
      let IsAvailable = await blogModel.findById(blogToBeModified).select({ authorId: 1, _id: 0 })
      if (!IsAvailable) { return res.status(404).send({ status: false, msg: "No blog with this Id exist" }) }
      if (IsAvailable["authorId"].valueOf() != authorLoggedIn){ return res.status(400).send({
         status: false, msg: 'Author logged is not allowed to modify the requested users data' })}
      //deletion   
      let deletedData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },{$set: { isDeleted: true, deletedAt: new Date() }},)
      res.status(200).send()
      if (deletedData==null0) { return res.status(404).send({ status: false, msg: "data not found" }) }
  }
  catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message })
  }
}

const deleteByQueryParams = async function (req, res) {
  try {
    let spaceIn = Object.keys(req.query)
    if (!spaceIn[00].trim()) { }
    let authorid = req.query.authorId
    //validate author id
    if (authorid) {
      if (!mongoose.isValidObjectId(authorid)){
        return res.send({ msg: "Enter valid object Id" })}
      let savedBlogData = await authorModel.findOne({ _id: authorid })
      if (!savedBlogData) { return res.status(400).send({ status: false, msg: "author id does not exits" }) }
    }
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, msg: "token must be present" })
    let decodedToken = jwt.verify(token, 'project-blog')
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is not valid" })
    let blogData = await blogModel.findOne({
       $or: [{ category: req.query.catagory}, { authorId: req.query.authorid }, { tags:req.query.tags}]}).select({authorId:1,_id:0})
    if(!blogData){return res.status(400).send({status:false, msg:"invalid request"})}
    let authorToBeModifiedByQuery = blogData["authorId"].valueOf()
   // userId for the logged-in user
    let authorLoggedIn = decodedToken.authorId
   // userId comparision to check if the logged-in user is requesting for their own data
    if (authorToBeModifiedByQuery !== authorLoggedIn) return res.status(401).send({ status: false, msg: 'you are not authorised, login with correct user id or password' })
//deletion process
    let deletedData = await blogModel.findOneAndUpdate(
      {
        isDeleted: false, $or: [{ category: req.query.catagory}, { authorId: authorid }, { tags:req.query.tags}, { isPublished: false }]
      },{$set:{ isDeleted: true, deletedAt: new Date() }}, )
    //if there is no data then it will retun an error
    if (deletedData ==null) { return res.status(400).send({ status: false, msg: "Data  has been already deleted" }) }
    res.status(200).send({status:true, data:deletedData})
    
  }
  catch (err) {
    return res.status(500).send({ msg: "error", error: err.message })
  }
}
module.exports.createBlog = createBlog;
module.exports.getBlogData = getBlogData;
module.exports.updateBlog = updateBlog;
module.exports.deleteByParams = deleteByParams;
module.exports.deleteByQueryParams = deleteByQueryParams;

