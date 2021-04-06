const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    date:{type:String,required:true},
    time:{type:String,required:true},
    doctorId:{type:String,required:true},
    patientId:{type:String,required:true},
    paymentId:{type:String,required:true},
    approve:{type:Boolean}
});

module.exports = mongoose.model('Appointment',appointmentSchema);
