// - user can signup as an buyer / seller
// - A seller can buy the items but a buyer can't sell an item without becoming seller
// - buyer can see all the items that needs to be sold and seller can see the items that needs to be bought
// - once a item is sold no other person can try to buy the item.  

const Product = require('../models/product')
const productController = {};

productController.addProduct = async (req,res) => {
    // A seller can buy the items but a buyer can't add item to sell without becoming seller
    // only seller can add product to sell
    if (req.user.role === "seller") {
        const newProduct = new Product ({
            productName: req.body.productName,
            discription: req.body.discription,
            condition: req.body.condition,
            price: req.body.price,
            sold: req.body.sold,
            sellerId: req.user._id,
        });
    
        await newProduct.save(function(err) {
            if (!err) {
                res.send("Successfully added new product")
            } else {
                res.send(err)
            }
        });
    } else {
        res.send("Buyer cannot add product to sell.");
    }
}

// view single product
productController.viewProduct = async (req,res) => {
    let id = req.params.pid;
    const product = await Product.findById(id)

    if (!product) res.send("No product found")
    res.send(product)
}

// buy product
productController.buyProduct = async (req,res) => {
    let id = req.params.pid;
    const product = await Product.findOne({_id : id})

    if (req.user._id == product.sellerId) res.send("Cannot buy. Already you product");

    if (!product.sold) {
        product.sold = true;
        product.buyerId = req.user._id;
        await product.save()
        res.status(200).json({message:"product is yours", product});
    } else {
        res.status(200).json({message:"Already Sold", product});
    }
    
}

module.exports = productController;