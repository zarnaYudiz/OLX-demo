const mongoose = require('mongoose')

// product discription schema
const productDiscriptionSchema = new mongoose.Schema({
    productName: String,
    discription: String,
    productId: String,
    condition: String,
    price: Number,
    sold: Boolean,
    quantity: Number,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const ProductDiscription = mongoose.model("ProductDiscription", productDiscriptionSchema);

module.exports = ProductDiscription;