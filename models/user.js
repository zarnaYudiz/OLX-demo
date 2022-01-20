const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// user schema
const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    username: {type:String, unique:true},
    password: String,
    role: String,
})
const User = mongoose.model("User", userSchema);

module.exports = User;