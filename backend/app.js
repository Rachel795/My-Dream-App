const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

//process.env.MONGO_ATLAS_PW |
const password =  "tbsZGFTYq2157eQg";
mongoose.connect("mongodb+srv://max:" +password+ "@cluster0-xvz5a.mongodb.net/test")
.then(() =>{
    console.log('conected to database');})
.catch(()=>{
    console.log('conected failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {

res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS"); 
res.setHeader("Access-Control-Allow-Headers",
    "authoriation, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  
next();
  });

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;