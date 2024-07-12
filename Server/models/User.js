const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema ({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Gender:{
        type:String,
        required:true
    },
    DOB:{
        type:String,
        required:true,
        Default:Date.now
    },
    Password:{
        type:String,
        required:true
    },
    IsVerified:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('User',UserSchema);