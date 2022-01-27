const router = require('express').Router();
const userController = require('./userController');
const productController = require('./productController');
const middleware = require('./middleware');
const validators = require('./validators');

// user
router.get('/users', middleware.authenticateToken, userController.user);
router.post('/signup', validators.addUser, userController.userSignup);
router.post('/login', validators.login, userController.userLogin);
router.delete('/logout', middleware.authenticateToken, userController.logout);
router.get('/show-products', middleware.authenticateToken, userController.showProducts);
router.post('/add-user-profile-picture', middleware.authenticateToken, userController.addUserProfilePicture);
//show - user with buyed from and sold to (product details)
// product transaction - details of product (howmany) - single item-multiple sell (USE transaction what, why, when , how, where, adv., disadv)
// product inventory - if no product in invent then send msg


// product
router.post('/add-product', middleware.authenticateToken, validators.addProduct, productController.addProduct);
router.get('/view-product/:pid', middleware.authenticateToken, productController.viewProduct);
router.get('/buy-product/:pid', middleware.authenticateToken, productController.buyProduct);

module.exports = router;