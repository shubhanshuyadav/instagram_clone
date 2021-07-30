const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt=require('bcryptjs');

router.get("/",(req,res)=>{
    res.send("Hello");
})

router.post("/singup",(req,res)=>{
   const{name,email,password}=req.body
   if(!email || !password || !name){
       return res.status(422).json({error:"please add all the field"})
   }
   User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exist with this email"})
        }

        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
    
            user.save()
            .then(user=>{
                res.json({message:"saved succesfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
      
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports= router;