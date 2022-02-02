const router = require('express').Router();
const userController = require('./userController');
const productController = require('./productController');
const middleware = require('./middleware');
const validators = require('./validators');
const { validate } = require('../models/user');

// user
router.get('/users', middleware.authenticateToken, userController.user);
router.post('/signup', validators.addUser,validate, userController.userSignup);
router.post('/login', validators.login, userController.userLogin);
router.delete('/logout', middleware.authenticateToken, userController.logout);
router.post('/add-user-profile-picture', middleware.authenticateToken, userController.addUserProfilePicture);

//show - user with buyed from and sold to (product details) // new collection
// product transaction - details of product (howmany) - single item-multiple sell 
// product inventory - if no product in invent then send msg
// five user can login and if sixth comes then remove first

// product
router.post('/add-product', middleware.authenticateToken, validators.addProduct, productController.addProduct);
router.get('/view-product/:pid', middleware.authenticateToken, productController.viewProductDiscription);
router.get('/buy-product/:pid', middleware.authenticateToken, productController.buyProduct);
router.get('/show-products', middleware.authenticateToken, productController.showProducts);
router.get('/view-product-inventory', middleware.authenticateToken, productController.viewAllInventoryProducts);

// seller
// get seller's sold items to buyer
router.get('/show-sold-products', middleware.authenticateToken, productController.showSoldProducts);

//buyer
//get buyer's bought items to seller
router.get('/show-bought-products', middleware.authenticateToken, productController.showBoughtProducts);

module.exports = router;