const express = require("express");
const app = express();
const mongoose= require("mongoose");
const { MONGOURI } = require("./keys");

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on("connected",()=>{
    console.log("connected to mongo");
})


mongoose.connection.on("error",(err)=>{
    console.log("connected to mongo", err);
})

app.get("/", function(req,res){
    res.send("Hello world");
});

app.listen("3000",function(req,res){
    console.log("server is running on port 3000");
});
