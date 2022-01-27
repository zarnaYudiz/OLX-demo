// - user can signup as an buyer / seller
// - A seller can buy the items but a buyer can't sell an item without becoming seller
// - buyer can see all the items that needs to be sold and seller can see the items that needs to be bought
// - once a item is sold no other person can try to buy the item.   

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const index = require('./routes/index');
require('dotenv').config();
const path = require('path');
const app = express();
var multer  = require('multer')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(express.json())

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database..'))
  .catch(error => {
    console.log('Connection to Database failed..')
    console.log(error) 
})

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

//user routes
app.use('/', index);


app.listen(process.env.PORT, function(req,res){
    console.log("Server is listening on post 3000");
})

