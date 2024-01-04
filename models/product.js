const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { type: String, required: true },
    price: Number,
    quality: Number,
    image: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;