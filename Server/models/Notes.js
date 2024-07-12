const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    Tags:{
        type:String
    },
    Description:{
        type:String
    },
    Date:{
        type:String,
        Default:Date.now
    }
});

module.exports = mongoose.model('Notes',NotesSchema);