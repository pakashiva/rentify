const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose"); 

let userSchema = new mongoose.Schema({
    email : {
        type : String,
    }
})

userSchema.plugin(passportlocalmongoose);      //used for hashing,salting , sets username and password by itself
 
module.exports = mongoose.model('User' , userSchema);