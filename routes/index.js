const router = require('express').Router();
const userController = require('./userController');
const productController = require('./productController');

console.log("Index file");

// user
router.get('/users', userController.user);
router.post('/signup', userController.user_signup);
router.post('/login', userController.user_login);

// product
router.post('/add-product', productController.add_product);
router.get('/view-product/:pid', productController.view_product);
router.get('/buy-product/:pid', productController.buy_product);

module.exports = router;