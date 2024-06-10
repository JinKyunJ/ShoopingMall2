const mongoose = require('mongoose');
const productSchema = require('./schemas/productSchema');

// ProductSchema 모델링
exports.Product = mongoose.model('Product', productSchema);