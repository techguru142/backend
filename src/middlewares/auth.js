const jwt = require('jsonwebtoken')

const checkAuth = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, message: "token must be present" })
    let decodedToken = jwt.verify(token, 'project-bookManagement')
    if (!decodedToken) return res.status(401).send({ status: false, message: "token is not valid" })
    next()
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message })
  }
}



module.exports.checkAuth = checkAuth;