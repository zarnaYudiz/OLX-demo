const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = {};


middleware.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        return res.status(401)
    }
    let result = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET)  
    const user = await User.findOne({ username : result.name})
    if (!user) {
        res.send("User not found..!")
    }
    req.user = user
    next()
}

module.exports = middleware;