const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var chatSchema = new Schema({
    description:{type:String,required:true},
    senderId:{type:String,required:true},
    receiverId:{type:String,required:true}
},{
    timestamps:true
});

module.exports = mongoose.model('Chat',chatSchema);