// - user can signup as an buyer / seller
// - A seller can buy the items but a buyer can't sell an item without becoming seller
// - buyer can see all the items that needs to be sold and seller can see the items that needs to be bought
// - once a item is sold no other person can try to buy the item.   

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const app = express();
let token = ""

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://zarnapatel:testpassword@cluster0.cjxny.mongodb.net/olxDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database..'))
  .catch(error => {
    console.log('Connection to Database failed..')
    console.log(error)
})

// user schema
const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    username: {type:String, unique:true},
    password: String,
    role: String
})
const User = mongoose.model("User", userSchema);

// product schema
const productSchema = new mongoose.Schema({
    productName: String,
    discription: String,
    condition: String,
    price: Number,
    sold: Boolean,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})
const Product = mongoose.model("Product", productSchema);

app.get("/users", function(req,res){
    User.find(function(err, foundUsers){
        if (!err) {
            console.log(foundUsers);
            res.send(foundUsers);
        } else {
            console.log(err);
        }  
    });
})

app.post("/signup", function(req, res) {

    const newUser = new User ({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    });
    newUser.save(function(err){
        if (!err) {
            res.send("Successfully added a new user")
        } else {
            res.send(err)
        }
    });
})

app.post("/login", function(req,res) {
    role = req.body.role;

    User.findOne({username: req.body.username}, function(err, foundUser){
        token = foundUser._id;
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
})

// add product
app.post("/add-product", async function(req, res) {
    // A seller can buy the items but a buyer can't sell an item without becoming seller
    // only seller can add product to sell
    
    const user = await User.find({username:req.header("Authorization")})

    if (!user) {
        res.send("login..!")
    }
    console.log(user)
    if (user[0].role === "seller") {
        const newProduct = new Product ({
            productName: req.body.productName,
            discription: req.body.discription,
            condition: req.body.condition,
            price: req.body.price,
            sold: req.body.sold,
            sellerId: user[0]._id,
        });
    
        newProduct.save(function(err) {
            if (!err) {
                res.send("Successfully added new product")
            } else {
                res.send(err)
            }
        });
    } else {
        res.send("Cannot add product to sell. Login as seller to add product.");
    }
})

// view single product
app.get("/view-product/:pid", function(req, res){
    let id = req.params.pid;
    Product.findById(id, function (err, foundProduct) {
        if (!err) {
            res.send(foundProduct)
        } else {
            console.log(err)
        }
    });
})

// buy product
app.get("/buy-product/:pid", async function(req, res){
    const user = await User.find({username:req.header("Authorization")})

    if (!user) {
        res.send("login..!")
    }
    let id = req.params.pid;

    const product = await Product.findOne({_id : id})
    console.log(product.sold);

    if (user[0]._id == product.sellerId) res.send("Cannot buy. Already you product");

    if (!product.sold) {
        product.sold = true;
        product.buyerId = user[0]._id;
        await product.save()
        res.status(200).json({message:"product is yours", product});
    } else {
        res.status(200).json({message:"Already Sold", product});
    }
    
})

app.listen(3000, function(req,res){
    console.log("Server is listening on post 3000");
})

