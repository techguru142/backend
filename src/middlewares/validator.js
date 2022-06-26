const jwt = require('jsonwebtoken')


const checkAuth = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    // console.log(token)
    if (!token) return res.status(404).send({ status: false, msg: "token must be present" })
    let decodedToken = jwt.verify(token, 'project-blog')
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is not valid" })
    next()
  } catch (err) {
    res.status(500).send({ status: false, Error: err.message })
  }
}

// const authorise =async function (req, res, next) {
//   try {
//     let token = req.headers["X-Api-Key"]
//     if (!token) token = req.headers["x-api-key"]
  
//     if (!token) return res.status(404).send({ status: false, msg: "Token must be present" })
//     let decodedToken = jwt.verify(token, 'project-blog')
//     if (!decodedToken) return res.status(400).send({ status: false, msg: "Token is not valid" })

//     if (req.params) {
//       let blogToBeModified = req.params


//       let IsAvailable = await blogModel.findById(blogToBeModified)
//       if (!IsAvailable) { return res.status(404).send({ status: false, msg: "No blog with this Id exist" }) }

//       if (IsAvailable) {
//         let authorLoggedIn = decodedToken.authorId
//         let blogAuthor = await blogModel.findById(blogToBeModified).select("authorId")
//         if (blogAuthor != authorLoggedIn) return res.status(400).send({ status: false, msg: 'Author logged is not allowed to modify the requested users data' })
//       }
//     }

//     if (req.query) {
//      let blogToBeModified = req.query

//       let authorLoggedIn = decodedToken.authorId
//       let authorizingModification = await blogModel.find(authorLoggedIn).select(blogToBeModified)
      
//       if (!authorizingModification) return res.status(400).send({ status: false, msg: 'Logged in Author has no document with entered key and value' })
//     }
//     next()

//   }
//   catch { }
// }

module.exports.checkAuth = checkAuth;
// module.exports.authorise = authorise;