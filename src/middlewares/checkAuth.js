const jwt = require('jsonwebtoken')


const Auth = async function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, msg: "Token must be present" })
    let decodedToken = jwt.verify(token, 'book-management-project')
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is not valid" })

    else {
      req.author = decodedToken.authorId
      console.log(decodedToken)
    next()
    }
  }

  catch (err) {
   return res.status(500).send({ status: false, Error: err.message })
  }
}



module.exports.Auth = Auth;

