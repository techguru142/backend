const jwt = require('jsonwebtoken')


const checkAuth = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, msg: "token must be present" })
    let decodedToken = jwt.verify(token, 'project-blog')
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is not valid" })
    next()
  } catch (err) {
    res.status(500).send({ status: false, Error: err.message })
  }
}



module.exports.checkAuth = checkAuth;

