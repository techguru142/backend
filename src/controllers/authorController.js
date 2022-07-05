const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")


const createAuthor = async function(req, res){
  try{


    let data = req.body




    //if fname is not present
    if(!data.fname){return res.status(400).send({status:false, msg:"fname is missing"})}
    //if fname is present then please check
    if(data.fname){
      let nameValidation = /^[A-Za-z]+$/
    if (!nameValidation.test(data.fname)) { return res.status(400).send({ status:false, msg: "Numbers or WhiteSpaces are not allowed in fname" }) }
      // if(data.fname.trim().length==0) return res.status(400).send({status:false,msg:"empty space is not allowed"})
    
    }





    //if lname is not present
    if(!data.lname){return res.status(400).send({status:false, msg:"lname is missing"})}
    //if lname is present then please check
    if(data.lname){
      // if(data.lname.trim().length==0 ) return res.status(400).send({status:false,msg:"empty space is not allowed"})
      let nameValidation = /^[A-Za-z]+$/
      if (!nameValidation.test(data.lname)) { return res.status(400).send({ status:false, msg: "Numbers or whiteSpaces are not allowed in lname" }) }
    }





    //title mandatory
    if(!data.title){return res.status(400).send({status:false, msg:"title is missing"})}
    if(data.title){
      // if(data.title.trim().length==0 ) return res.status(400).send({status:false,msg:"empty space is not allowed"})
      // if(!isNaN(data.title)){ return res.status(400).send({status:false, msg:"title can not be a number"})}
      let condition;
      if(data.title === "Mr" || data.title==="Miss" || data.title==="Mrs")
      {
        condition = "true"
      }
    

    if(condition!="true") {return res.status(400).send({status:"false",msg:"title must be Mr,Mrs and Miss only"})}
    }






    //email mandatory
    if(!data.email){return res.status(400).send({status:false, msg:"email is missing"})}
    let email = data.email
    if(email){
      let emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
      if(!email.match(emailregex)){ return res.status(400).send({status:false,msg:"Email is invalid"})}
      let savedAuthorData = await authorModel.find({email:email})
      if(savedAuthorData.length>0)
        return res.status(400).send({status:false,msg:"Email is already exists"})
    }






     //password mandatory
     if(!data.password){ return res.status(400).send({status:false, msg:"password is missing"})}
    if(data.password.length<5){return res.status(400).send({status:false, msg:"password should be minimum five character"})}
     //create
    let savedAuthorData = await authorModel.create(data)
    res.status(201).send({status:true,data:savedAuthorData})
  }



  catch(err){
   return res.status(500).send({msg:"Error", error:err.message})
  }
}





const loginAuthor = async function(req,res){
  try{
  let email = req.body.email
  let password = req.body.password
  let author = await authorModel.findOne({email:email,password:password})
  if(!author){return res.send("Please use correct email or password")}
  let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organisation: "FunctionUp",
      },
      "project-blog"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, data:{token: token }});
  }catch(err){
    return res.status(500).send({msg:"Error",Error:err.message})
  }
  };



  

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor
