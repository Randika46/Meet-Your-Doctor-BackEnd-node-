const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var patientSchema = new Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    address:{type:String,required:true},
    contactNumber: {type:Number},
    locations:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
    image:{type:String}
});

module.exports = mongoose.model('Patient',patientSchema);