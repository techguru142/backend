const blogModel = require("../models/blogModel")
const middlewares = require('../middlewares/checkAuth')
const { isValid, isValidDate,isValidArray } = require('../controllers/validattor')
// const authorModel = require("../models/authorModel")
// const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const createBlog = async function (req, res) {
  try {

    let data = req.body
    let {title,body,authorId,tags,category,subcategory,isPublished,publishedAt} = data
    //mandatory => title,body,authorId,category

    
    if (Object.keys(req.body).length < 1) return res.status(400).send({
      status: false,
      message: "Insert data "
    })

    //title is mandatory
    if (!isValid(title)){
      return res.status(400).send({ status: false, msg: "Title is missing" }) 
    }


    if(!isValid(body)){
      return res.status(400).send({status:false,message:'Enter blog body !!'})
    }

    if(!isValid(authorId)){
      return res.status(400).send({status:false,message:'Enter AuthorId !!'})
    }

    if(!mongoose.isValidObjectId(authorId)){
      return res.status(400).send({status:false,message:'Enter Valid authorId !!'})
    }

    if(tags && !isValidArray(tags)){
      return res.status(400).send({status:false,message:'Tags should be in form of Array !!'})
     }

    //category is mandatory
    if(!category){
      return res.status(400).send({status:false,message:"Enter category of blog !!"})
    }

   if(!isValidArray(category)){
    return res.status(400).send({status:false,message:'Category should be present in form of an Array'})
   }

   if(subcategory && !isValidArray(subcategory)){
    return res.status(400).send({status:false,message:'Subcategory should be in form of Array'})
   }

   if(typeof(isPublished) != 'boolean') {
    return res.status(400).send({status:false, message:'Value should be boolean for isPublished !!'})
   }

   if(publishedAt && !isValidDate(publishedAt)){
    return res.status(400).send({status:false,message:'Enter Date in Valid format !!'})
   }

    //once all condition sutisfied successfully then data will be created
    let createdBlogData = await blogModel.create(data)
   return res.status(201).send({ status: true, data: createdBlogData })

  }


  catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message })
  }

}




const getBlogData = async function (req, res) {
  try {
    let authorId = req.query.authorId

    if(authorId && !mongoose.isValidObjectId(authorId)){
      return res.status(400).send({status:false,message:"Invalid AuthorId !!"})
    }

    if (authorId) {
      let savedAuthorData = await authorModel.findById({ _id: authorId })
      if (!savedAuthorData) return res.status(400).send({ status: false, msg: "No author with this id is present !!" })
    }

    let savedBlogData = await blogModel.find({ isPublished: true, isDeleted: false, $or: [{ tags: req.query.tags }, { category: req.query.category }, { subcategory: req.query.subcategory }, { authorId: req.query.authorId }] })
    // when no one data exits
    if (savedBlogData.length == 0) { return res.status(404).send({ status: false, msg: "Data not founds" }) }
    res.status(200).send({ status: true, data: savedBlogData })
  }

  catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message })
  }
}





const updateBlog = async function (req, res) {
  try {

    let id = req.params.blogId
    if (!mongoose.isValidObjectId(id))
      return res.send({ msg: "Enter valid object Id" })

      let blogAuthor = await blogModel.findById({_id:id}).select(authorId)

      let author = req.author

      if(blogAuthor != author){
        return res.status(403).send('You are not authorized to perform this action !')
      }


      let data = req.body

      let {title,body,tags,subcategory} = data

   
      if(!isValid(title)){
        return res.status(400).send('Enter title for updation !!')
      }

      if(!isValid(body)){
        return res.status(400).send({status:false,message:'Enter blog body !!'})
      }
  
      if(!tags){
        return res.status(400).send({status:false,message:'Enter tags for updation !!'})
      }

      if(tags && !isValidArray(tags)){
        return res.status(400).send({status:false,message:'Tags should be in form of Array !!'})
       }


       if(!isValidArray(subcategory)){
        return res.status(400).send({status:false,message:'Subcategory should be in form of Array !!'})
       }


    let updateData = await blogModel.findOneAndUpdate({ "_id": id }, {
      $set: {
        title: title,
        body: body,
        publishedAt: new Date(),
        isPublished: true
      }, $push: { tags: tags, subcategory: subcategory },
    }, { new: true })

    res.status(200).send({ status: true, message: "Updated successfully", data: updateData })
  }

  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: "", error: err.message })
  }
}






// //Delete api
const deleteByParams = async function (req, res) {
  try {
  
    let blogId = req.params.blogId
    if (!mongoose.isValidObjectId(blogId)) {
      return res.send({ msg: "Enter valid object Id" })
    }

   // let findBlog = await blogModel.find({_id:blogId})
   

    let blogAuthor = await blogModel.findById({_id:id}).select(authorId)

    if(!blogAuthor){
      return res.status(400).send({status:false,message:"No blog exists with this id !!"})
    }

      let author = req.author

      if(blogAuthor != author){
        return res.status(403).send('You are not authorized to perform this action !')
      }

    //deletion   
    let deletedData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })
   // console.log(deletedData)
    if (deletedData == null) { return res.status(404).send({ status: false, msg: "Data has been already deleted !!" }) }
    return res.status(200).send({ status: true, data: deletedData })

  }

  catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message })
  }
}


const deleteByQueryParams = async function (req, res) {
  try {

    // console.log(req.decodedToken)
    let author = req.author


    let blogAuthor = await blogModel.findOne({
      $or: [{ category: req.query.category }, { authorId: req.query.authorid }, { tags: req.query.tags }]
    }).select({ authorId: 1, _id: 0 })


    if (!blogAuthor) { return res.status(400).send({ status: false, msg: "NO MATCHING DATA FOUND !!" }) }

  //  checking for authorization
    if(author != blogData) {
      return res.status(403).send({status:false,message:"You are not authorized to perform this operation !!"})
    }


    //deletion process
    let deletedData = await blogModel.findOneAndUpdate(
      {
        $or: [{ category: req.query.category }, { tags: req.query.tags }, { authorId: req.query.authorId }, { subcategory: req.query.subcategory }, { isPublished: req.query.isPublished }], isDeleted: false
      }, { isDeleted: true, deletedAt: new Date() }, { new: true })



    //if there is no data then it will retun an error
    if (deletedData == null) { return res.status(400).send({ status: false, msg: "Data already deleted !!" }) }
    res.status(200).send({ status: true, data: deletedData })

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

