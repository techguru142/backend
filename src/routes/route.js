const express = require("express")
const {urlShort, redirectUrl} = require("../controllers/urlController")
const router = express.Router()


router.post("/url/shorten", urlShort)
router.get("/:urlCode", redirectUrl)


module.exports = router