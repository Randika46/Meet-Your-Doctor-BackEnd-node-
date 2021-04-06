const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var paymentSchema = new Schema({
    amount:{type:Number,required:true},
    patientId:{type:String,required:true},
    doctorId:{type:String,required:true}
});

module.exports = mongoose.model('Payment',paymentSchema);