const mongoose = require('mongoose')

// seller's all product inventory schema
const productInventorySchema = new mongoose.Schema({
    productName: String,
    productId: String,
    totalQuantity: Number,
    remainingQuantity: Number,
    soldQuantity: Number,
    // sold: Boolean,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const ProductInventory = mongoose.model("ProductInventory", productInventorySchema);

module.exports = ProductInventory;