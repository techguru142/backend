const express = require("express");
const { createshortUrl, getUrl } = require("../controllers/urlController");
const router = express.Router();

router.post("/url/shorten", createshortUrl);
router.get("/:urlCode", getUrl);

module.exports = router;
