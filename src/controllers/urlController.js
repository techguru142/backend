const urlModel = require("../model/urlModel")
//const nanoid =  require('nanoid')
const shortId = require("shortid")
//const { validate } = require("../model/urlModel")
const validate = require("valid-url")

const isValidRequest = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

// const urlRegx =/^((ftp|http|https):\/\/)?(www.)?(?!.(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/
const urlRegx = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/



let urlShort = async function(req, res){
    try {
        const {longUrl} = req.body
        const urlExists = await urlModel.findOne({longUrl: longUrl}).select({__v: 0, _id: 0})
        
        if(urlExists){
            return res.status(200).send({status: true,message: `${longUrl.trim()}, This URL has already been shortened`
            , data: urlExists})
        }
        if(!isValidRequest(longUrl)){
            return res.status(400).send({status: false, message: "Please provide a URL"})
        }
        if(!urlRegx.test(longUrl)){
            return res.status(400).send({status: false, message: "Please provide a valid URL"})
        }
    
    
        const baseUrl = "localhost:3000"
        const urlCode = shortId.generate(longUrl)
        const shortUrl = baseUrl + '/'+ urlCode.toLowerCase()
        //const shortUrl = `http://localhost:3000/${urlCode}`
    
        const obj = {}
        obj["longUrl"] = longUrl
        obj["shortUrl"] = shortUrl
        obj["urlCode"] = urlCode
        await urlModel.create(obj)
        //const result1 = await urlModel.findOne(result).select({__v: 0, _id: 0})
        return res.status(201).send({status: true, data: obj})
            
        
        
        
        
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
        
    }
}

const redirectUrl = async function(req, res){
    try {
        const urlCode = req.params.urlCode
    //console.log(urlCode)
    // if(!isValidRequest(urlCode)){
    //     return res
    //         .status(400)
    //         .send({status: false, message: "Enter a valid urlCode"})
    // }


    const findUrlCode = await urlModel.findOne({urlCode: urlCode})//.select({__v: 0, _id: 0, urlCode: 0, shortUrl:0})
    res.status(302).redirect(findUrlCode.longUrl)
        
    } catch (error) {
        res.status(500).send({status: false, message: error.message})
    }
    
    
    //console.log(findUrlCode)
    


}

module.exports = {urlShort, redirectUrl}