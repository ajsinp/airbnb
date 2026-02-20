const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:[true, 'First name is required']
    },
    lastName: String,
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        unique:true
    },
    userType:{
        type:String,
        enum:['guest','host'],
        default:'guest',
    },
    favourites:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Home'
    }]
});

module.exports = mongoose.model("User", homeSchema);
