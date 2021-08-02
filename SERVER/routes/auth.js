const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt=require('bcryptjs');
const jwt= require('jsonwebtoken');
const{JWT_SRT}=require('../keys');
const requireLogin=require('../middleware/requireLogin');

router.get("/protected",requireLogin,(req,res)=>{
    res.send("Hello user");
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

router.post('/singin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }

    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
               const token=jwt.sign({_id:savedUser._id},JWT_SRT);
               res.json({token})
            }
            else{
                return res.json({error:"Invalid Email or password"})
            }
        })

        .catch(err=>{
            console.log(err);
        })
    })
})


module.exports= router;