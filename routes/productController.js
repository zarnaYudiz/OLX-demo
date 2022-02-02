// - user can signup as an buyer / seller
// - A seller can buy the items but a buyer can't sell an item without becoming seller
// - buyer can see all the items that needs to be sold and seller can see the items that needs to be bought
// - once a item is sold no other person can try to buy the item.  

const mongoose = require('mongoose')
const ProductDiscription = require('../models/productDiscription');
const ProductInventory = require('../models/productInventory');
const SoldProduct = require('../models/soldProducts');
const productController = {};

productController.addProduct = async (req,res) => {

    const session = await mongoose.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try {
        await session.withTransaction(async () => {
            // A seller can buy the items but a buyer can't add item to sell without becoming seller
            // only seller can add product to sell
            if (req.user.role != "seller") res.send("Buyer cannot add product to sell.");

            let productId = req.body.productName + "-" + req.body.discription

            const productInvent = new ProductInventory ({
                productName: req.body.productName,
                productId: productId,
                totalQuantity: req.body.quantity,
                remainingQuantity: req.body.quantity,
                soldQuantity: 0,
                sellerId: req.user._id, 
            })
            const transaction1 = await productInvent.save({session})

            const newProduct = new ProductDiscription ({
                productName: req.body.productName,
                discription: req.body.discription,
                productId: productId,
                condition: req.body.condition,
                price: req.body.price,
                sold: req.body.sold,
                quantity: req.body.quantity,
                sellerId: req.user._id,
            });
            const transaction2 = await newProduct.save({session});

            await session.commitTransaction();
            return res.status(201).json({
                'status': 'Success',
                'message': 'Your Product added succesfully'
            })
        }, transactionOptions);
    } catch (error) {
        console.log('\nSomething went wrong\n')
        console.error(error);
        console.log('\nTransaction Aborted.....\n')
        await session.abortTransaction();
    } finally {
        await session.endSession();
        console.log('This is from Finally...\n', 'Transaction Committed Succesfully....')
    } 
}

// show all product list from inventory
productController.viewAllInventoryProducts = async (req,res) => {
    if (req.user.role != "seller") res.send("Login as seller to view product..!")

    // only sellers can view their own products
    const product = await ProductInventory.aggregate ([
        { $match: { "sellerId": { $in: [req.user._id] } } }
    ])

    if (!product) {
        res.send("Try again. No product found..!")
    } else {
        if (product.length < 1) res.send("You don't have any product to sell..!")
        res.send(product)
    }
}

// view single product
productController.viewProductDiscription = async (req,res) => {
    let id = req.params.pid;
    const product = await ProductDiscription.findById(id)

    if (!product) res.send("No product found")
    res.send(product)
}

// buy product
productController.buyProduct = async (req,res) => {
    if (req.user.role === "seller") res.send("Login as buyer. Seller cannot buy")
    let id = req.params.pid;
    const productDisc = await ProductDiscription.findOne({_id : id})

    if (productDisc.quantity > 0) {
        const session = await mongoose.startSession();         
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
        try {
            await session.withTransaction(async () => {
                
                // T1 - update product discription
                if (productDisc.quantity == 1) {productDisc.sold = true}
                productDisc.quantity = productDisc.quantity - 1;
                const transaction1 = await productDisc.save({session});

                // T2 - update quantity in  product inventory
                const updateInventProduct = {  $inc: { 'remainingQuantity': - 1 , 'soldQuantity': 1 } };
                const transaction2 = await ProductInventory.findOneAndUpdate(productDisc.sellerId, updateInventProduct, {session});

                // T3 - add product to sold
                let productId = productDisc.productName + "-" + productDisc.discription
                const soldProduct = new SoldProduct ({
                    productName: productDisc.productName,
                    discription: productDisc.discription,
                    productId: productId,
                    condition: productDisc.condition,
                    price: productDisc.price,
                    sellerId: productDisc.sellerId,
                    buyerId: req.user._id,
                });
                const transaction3 = await soldProduct.save({session});

                await session.commitTransaction();
                return res.status(201).json({
                    'status': 'Success',
                    'message': 'Bought successfully. product is yours',productDisc
                })
            
            }, transactionOptions);
        } catch (error) {
            console.error(error);
            console.log('\nTransaction Aborted.....\n')
            await session.abortTransaction();
        }
        finally {
            await session.endSession();
        }    
    } else {
        res.status(200).json({message:"Cannot buy. Stock unavailable"});
    }  
}

// - A seller can buy the items but a buyer can't sell an item without becoming seller
// - buyer can see all the items that needs to be sold and seller can see the items that needs to be bought
productController.showProducts = async (req,res) => {
    const role = req.body.role;
    let foundUser = await User.findOne({username: req.body.username})
    if(!foundUser) res.send("User does not exist..! Sign Up")
   
    if (foundUser.role === "buyer") {
        // Buyer - all unsold product
        let products = await ProductDiscription.find({sold:false})
        if (!products) res.send("All products are sold..!")
        res.send(products)
    } else {
        //Seller - seller's unsold products
        let products = await ProductDiscription.find({ userId:foundUser._id, sold:false })
        if (!products) res.send("Seller's all products are sold..!")
        res.send(products)
    }
}

// Show seller's sold product (to whom-buyer)
productController.showSoldProducts = async (req,res) => {
    if (req.user.role === "buyer") res.send("Login as seller. You do not have access to view sold products")
    let products = await SoldProduct.find({ sellerId: req.user._id })
    if (!products) res.send("No products sold till now")
    res.send(products)
}

// Show buyer's bought product (from whom-seller)
productController.showBoughtProducts = async (req,res) => {
    if (req.user.role === "seller") res.send("Login as buyer. You do not have access to view bought products")
    let products = await SoldProduct.find({ buyerId: req.user._id })
    if (!products) res.send("No products bought till now")
    res.send(products)
}

module.exports = productController;