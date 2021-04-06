const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var channelingSchema = new Schema({
    appointmentId:{type:String,required:true},
    date:{type:Date,required:true},
    time:{type:String}
});

module.exports = mongoose.model('Channeling',channelingSchema);