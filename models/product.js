const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productID: { type: String, required: true },
    productName: { type: String, required: true },
    price_old: String,
    price_current: String,
    quantity: Number,
    item_sold: Number,
    image: String,
    in_cart: Number, // 1: product is in cart, 0: not in cart
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;