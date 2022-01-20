const User = require('../models/user')
const Product = require('../models/product')
const productController = {};

console.log("product controller file")

productController.add_product = async (req,res) => {
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
}

// view single product
productController.view_product = (req,res) => {
    let id = req.params.pid;
    Product.findById(id, function (err, foundProduct) {
        if (!err) {
            res.send(foundProduct)
        } else {
            console.log(err)
        }
    });
}

// buy product
productController.buy_product = async (req,res) => {
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
    
}

module.exports = productController;