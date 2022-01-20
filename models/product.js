const mongoose = require('mongoose')
// const Schema = mongoose.Schema

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

module.exports = Product;