const urlModel = require("../model/urlModel")
//const nanoid =  require('nanoid')
const shortId = require("shortid")

let urlShort = async function(req, res){
    const {longUrl} = req.body
    if(!req.body){
        return res.status(400).send({status: false, message: "Please provide a valid url"})
    }
    const urlExists = await urlModel.findOne({longUrl: longUrl}).select({__v: 0, _id: 0})
    
    if(urlExists){
        return res.status(200).send({status: true, data: urlExists})
    }




    const baseUrl = "localhost:3000"
    const urlCode = shortId.generate(longUrl)
    const shortUrl = baseUrl + '/'+ urlCode.toLowerCase()
    //const shortUrl = `http://localhost:3000/${urlCode}`

    const obj = {}
    obj["longUrl"] = longUrl
    obj["shortUrl"] = shortUrl
    obj["urlCode"] = urlCode
    const result = await urlModel.create(obj)
    const result1 = await urlModel.findOne(result).select({__v: 0, _id: 0})
    res.status(201).send({status: true, data: result1})
    


}

const redirectUrl = async function(req, res){
    const urlCode = req.params.urlCode
    //console.log(urlCode)

    const findUrlCode = await urlModel.findOne({urlCode: urlCode}).select({__v: 0, _id: 0, urlCode: 0, shortUrl:0})
    //console.log(findUrlCode)
    return res.status(302).send(findUrlCode.longUrl)


}

module.exports = {urlShort, redirectUrl}