const jwt=require('jsonwebtoken')
const{}=require('../keys');
const mongoose=require('mongoose');
const User = mongoose.model("User");
const{JWT_SRT}=require('../keys');

module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return res.status(401).json({erros:"you must be logged in"})
    }

    const token =authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SRT,(err,payload)=>{
        if(err){
            return res.satus(401).json({error:"authorisation failed"})
        }

        const{_id} = payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next();
        })
       
    })
}