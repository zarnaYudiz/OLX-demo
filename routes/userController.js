
const User = require('../models/user')
const Product = require('../models/product')

const userController = {};

console.log("User controller file");

userController.user = (req,res) => {
    User.find(function(err, foundUsers){
        if (!err) {
            console.log(foundUsers);
            res.send(foundUsers);
        } else {
            console.log(err);
        }  
    });
}

userController.user_signup = async (req,res) => {

    const newUser = await User.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    });
    if (!newUser) res.send("Error in user creation")

    res.send("user created successfully")
 }

userController.user_login = (req,res) => {
    role = req.body.role;
    console.log(role);

    User.findOne({username: req.body.username}, function(err, foundUser){
        let token = foundUser._id;
        if(!err) {
            if (foundUser.role === "buyer") {
                // Buyer - all unsold product
                Product.find({sold:false}, function(err, foundProduct) {
                    if (!err) {
                        console.log("Buyer", foundProduct)
                        res.send(foundProduct);
                    } else {
                        res.send(err)
                    }
                })
            } else {
                //Seller - seller's unsold products
                Product.find({userId:token, sold:false}, function(err, foundProduct) {
                    if (!err) {
                        console.log("Seller", foundProduct)
                        res.send(foundProduct);
                    } else {
                        res.send(err)
                    }
                })
            }
        } else {
            res.send("User does not exist..! Sign Up")
        }
    })
}

module.exports = userController;