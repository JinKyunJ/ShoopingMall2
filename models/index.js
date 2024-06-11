const mongoose = require('mongoose');
const productSchema = require('./schemas/productSchema');
const userSchema = require('./schemas/userSchema');
const orderSchema = require('./schemas/orderSchema');
const categorySchema = require('./schemas/categorySchema');

// ProductSchema, userSchema, orderSchema, categorySchema 모델링
exports.Product = mongoose.model('Product', productSchema);
exports.User = mongoose.model('User', userSchema);
exports.Order = mongoose.model('Order', orderSchema);
exports.Category = mongoose.model('Category', categorySchema);