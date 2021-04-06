const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var doctorSchema = new Schema({
    name:{type:String,required:true},
    id:{type:String,required:true},
    channelingCentre:{type:String},
    address:{province:{type:String},district:{type:String}},
    hospital:{type:String},
    nursingHome:{type:String},
    qualifications:{type:String},
    rating:{type:Number},
    noOfRaters:{type:Number},
    specialities:{type:String},
    contactNumber:{type:Number},
    email:{type:String,required:true},
    password:{type:String,required:true},
    image:{type:String},
    workingHours:{type:String},
    workingDays:{type:String}
});

module.exports = mongoose.model('Doctor', doctorSchema);