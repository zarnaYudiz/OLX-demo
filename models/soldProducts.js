const mongoose = require('mongoose')

// product discription schema
const soldProductSchema = new mongoose.Schema({
    productName: String,
    productId: String,
    discription: String,
    condition: String,
    price: Number,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const SoldProduct = mongoose.model("Sold-Product", soldProductSchema);

module.exports = SoldProduct;