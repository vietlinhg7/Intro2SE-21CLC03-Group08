const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { type: String, required: true },
    price_old: String,
    price_current: String,
    quantity: Number,
    item_sold: Number,
    image: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;