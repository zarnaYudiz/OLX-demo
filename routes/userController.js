// - user can signup as an buyer / seller
// - A seller can buy the items but a buyer can't sell an item without becoming seller
// - buyer can see all the items that needs to be sold and seller can see the items that needs to be bought
// - once a item is sold no other person can try to buy the item.  


require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const multerUpload = require('../multer.config').multerUpload;
const { applyMiddleware } = require('redux');
const ProductDiscription = require('../models/productDiscription');

const userController = {};
let accessTokens = [];

// get all user
userController.user = async (req,res) => {
    let dbQuery = {};
    // search user
    if (req.query.searchText && req.query.searchText != "") {
        dbQuery = {...dbQuery, ...{
            $or:[
                {"fname": { $regex: new RegExp('^' + req.query.searchText, "i")}},
                {"lname": { $regex: new RegExp('^' + req.query.searchText, "i")}},
                {"username": { $regex: new RegExp('^' + req.query.searchText, "i")}}
            ]
        }}
    } 
    const user = await User.find(dbQuery);
    if (!user) {
        res.send("No user found..!")
    } else {
        res.send(user)
    }
}

// upload user profile picture
userController.addUserProfilePicture = async (req, res) => {
    const username = req.user.username;
    req.uploadDir = `user`;
    let resultofImage =  multerUpload(req, res, async (error, result) => {
        if (error) {
            console.log(error);
            res.send("Error uploading image")
        }
        if (req.file) {
            let uploadProfileImg = await User.updateOne({ username }, { profileImage : req.file.filename})
            if(!uploadProfileImg) res.send("Error uploading image to database")
            res.send("image uplaoded in db successfully")
        }
    })
}

// add new user
userController.userSignup = async (req,res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log("SALT:", salt)
        console.log("HASHED PASSWORD", hashedPassword)
        const newUser = await User.create({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        });
        if (!newUser) res.send("Error in user creation")
        res.send("user created successfully")
    } catch {
        res.status(500).send("User already exist..!");
    }
 }

// user login
userController.userLogin = async (req,res) => {
    const user = await User.findOne({username: req.body.username})
    if (user == null) res.status(400).send("User does not exist..! Sign Up")
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {   
            const username = req.body.username
            const accessToken = generateAccessToken({name:username})
            if (accessTokens.length < 5) { 
                accessTokens.push(accessToken) 
            } else {
                accessTokens.shift()
                accessTokens.push(accessToken) 
            }
            const updateUser = await User.updateOne({username}, {token: accessToken})
            if (!updateUser) res.status(400).send("User not updated")
            res.json({ "loginStatus": "Successfully logged in..!", accessToken: accessToken})
        } else { 
            res.send("Wrong password. Try again..!")
        }   
    } catch {
        res.status(500).send();
    }
}

// logout
userController.logout = async (req,res) => {
    let tokenRemoved = await User.updateOne({username: req.user.username}, {$unset: {token: 1 }})
    if (!tokenRemoved) res.send("Try logging out again")
    accessTokens.splice(accessTokens.filter(token => token == req.body.token),1)
    res.send("Login again")
}

// create access token 
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60d'});
}

module.exports = userController;

    