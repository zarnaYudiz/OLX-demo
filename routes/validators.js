const emailvalidator = require("email-validator");
const validators = {};

validators.addUser = (req, res, next) => {
    const body = req.body
    if (!body.fname) return res.send("First name required.")
    if (!body.lname) return res.send("Last name required.")
    if (!body.role) return res.send("User role required.")
    if (!body.email) return res.send("Email required.")
    if (!emailvalidator.validate(body.email)) res.status(400).send('Invalid Email');
    if (!body.username) return res.send("User name required.")
    if (!body.password) return res.send("Password name required.")
    next();
};

validators.login = (req, res, next) => {
    const body = req.body;
    if (!body.username) return res.send("User name required.")
    if (!body.password) return res.send("password required.")
    next();
};

validators.addProduct = (req, res, next) => {
    const body = req.body;
    if (!body.productName) return res.send("Product name required.")
    if (!body.discription) return res.send("Discription is required.")
    if (!body.condition) return res.send("Condition is required.")
    if (!body.price) return res.send("Price required.")
    // if (!body.sold.lenght) return res.send("Sold status required.")
    next();
};


module.exports = validators;