var validator = require('validator');
const validators = {};

validators.addUser = (req, res, next) => {
    const body = req.body
    if(validator.isEmpty(body.fname)) return res.send("fname required.")
    if(validator.isEmpty(body.lname)) return res.send("lname required.")
    if(!validator.isEmail(body.email)) return res.send("Invalid email.")
    if(validator.isEmpty(body.role)) return res.send("User role required.")
    if(validator.isEmpty(body.username)) return res.send("User name required.")
    if(validator.isEmpty(body.password)) return res.send("Password name required.")
    next();
};

validators.login = (req, res, next) => {
    const body = req.body;
    if(validator.isEmpty(body.username)) return res.send("User name required.")
    if(validator.isEmpty(body.password)) return res.send("Password name required.")
    next();
};

validators.addProduct = (req, res, next) => {
    const body = req.body;
    if(validator.isEmpty(body.productName)) return res.send("Product name required.")
    if(validator.isEmpty(body.discription)) return res.send("Discription is required.")
    if(validator.isEmpty(body.condition)) return res.send("Condition is required.")
    if(validator.isEmpty(body.price)) return res.send("Price required.")
    if(validator.isBoolean(body.sold)) return res.send("Sold status required.")
    if(validator.isEmpty(body.quantity)) return res.send("Quantity required.")
    next();
};

module.exports = validators;

