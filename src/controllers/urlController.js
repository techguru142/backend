const urlModel = require("../model/urlModel");
const shortId = require("shortid");
const axios = require("axios");
const { isValidRequest, isValid, urlRegx } = require("../validator/validation");

let createshortUrl = async function (req, res) {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please input valid request" });
    }
    const { longUrl } = req.body;

    if (!isValid(longUrl)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a URL" });
    }
    if (!urlRegx(longUrl)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid URL" });
    }
    const urlExists = await urlModel
      .findOne({ longUrl: longUrl })
      .select({ __v: 0, _id: 0 });

    if (urlExists) {
      return res.status(200).send({
        status: true,
        message: `${longUrl.trim()}, This URL has already been shortened`,
        data: urlExists,
      });
    }

    let urlFound = false;

    let object = {
      method: "get",
      url: longUrl,
    };
    await axios(object)
      .then((res) => {
        if (res.status == 201 || res.status == 200) urlFound = true;
      })
      .catch((err) => {});

    if (urlFound == false) {
      return res.status(400).send({ status: false, message: "Invalid URL" });
    }

    const baseUrl = "localhost:3000";
    const urlCode = shortId.generate();
    const shortUrl = baseUrl + "/" + urlCode.toLowerCase();

    const obj = {};
    obj["longUrl"] = longUrl;
    obj["shortUrl"] = shortUrl;
    obj["urlCode"] = urlCode;
    await urlModel.create(obj);

    return res.status(201).send({ status: true, data: obj });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUrl = async function (req, res) {
  try {
    const urlCode = req.params.urlCode;
    const findUrlCode = await urlModel.findOne({ urlCode: urlCode });
    if (!findUrlCode) {
      return res.status(404).send({ status: false, message: "URL not found" });
    }
    let longUrl = findUrlCode.longUrl;
    res.status(302).redirect(longUrl);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createshortUrl, getUrl };
