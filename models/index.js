const mongoose = require('mongoose');
const productSchema = require('./schemas/productSchema');
const userSchema = require('./schemas/userSchema');
const orderSchema = require('./schemas/orderSchema');
const categorySchema = require('./schemas/categorySchema');
const likeSchema = require('./schemas/likeSchema');
const cashSchema = require('./schemas/cashSchema');
const verifySchema = require('./schemas/verifySchema');

// ProductSchema, userSchema, orderSchema, categorySchema 모델링
exports.Product = mongoose.model('Product', productSchema);
exports.User = mongoose.model('User', userSchema);
exports.Order = mongoose.model('Order', orderSchema);
exports.Category = mongoose.model('Category', categorySchema);
exports.Like = mongoose.model('Like', likeSchema);
exports.Cash = mongoose.model('Cash', cashSchema);
exports.Verify = mongoose.model('Verify', verifySchema);