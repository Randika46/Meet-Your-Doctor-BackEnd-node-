const router = require('express').Router();
const Appointment = require('../models/appointment');
const multer = require('multer');
const upload = multer();
router.route('/add').post(upload.none(),(req,res)=>{
    const {date,time,doctorId,patientId,paymentId} = req.body;
    const approve = false;
    var newAppointment = new Appointment({
        date,
        time,
        doctorId,
        patientId,
        paymentId,
        approve
    });
    newAppointment.save().then((appointment)=>{
        res.json({state:true,message:"Appointment added successfully completed.",details:appointment});
    }).catch((err)=>{
        res.json({state:false,message:"Something's wrong with adding appointment! Please Try again later.",err:err});
    });
})

router.route('/').get((req,res)=>{
    Appointment.find().then((appointments)=>{
        res.json({state:true,details:appointments});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/update/:id').put(upload.none(),(req,res)=>{
    var appointmentId = req.params.id;
    const {date,time,doctorId,patientId,paymentId} = req.body;
    var updateAppointment = {
        date,
        time,
        doctorId,
        patientId,
        paymentId
    };
    Appointment.findByIdAndUpdate(appointmentId,updateAppointment).then((update)=>{
        res.json({state:true,message:"Appointment is successfully updated.",details:update});
    }).catch((err)=>{
        res.json({state:false,message:"Something's wrong with updating the appointment! Please Try again later.",err:err});
    });
})

router.route('/delete/:id').delete((req,res)=>{
    var appointmentId = req.params.id;
    Appointment.findByIdAndDelete(appointmentId).then((appointment)=>{
        res.json({state:true,message:"Appointment is successfully deleted.",details:appointment});
    }).catch((err)=>{
        res.json({state:false,message:"Something's wrong with deleting appointment! Please Try again later.",err:err});
    });
})

router.route('/:id').get((req,res)=>{
    var appointmentId = req.params.id;
    Appointment.findById(appointmentId).then((appointment)=>{
        res.json({state:true,details:appointment});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/doctor/:id').get((req,res)=>{
    var doctorId = req.params.id;
    Appointment.find({doctorId:doctorId}).then((appointments)=>{
        res.json({state:true,details:appointments});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/patient/:id').get((req,res)=>{
    var patientId = req.params.id;
    Appointment.find({patientId:patientId}).then((appointments)=>{
        res.json({state:true,details:appointments});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/approve/:id').put(upload.none(),async(req,res)=>{
    var appointmentId = req.params.id;
    Appointment.findById(appointmentId).then((appointment)=>{
        appointment.approve = true;
        Appointment.findByIdAndUpdate(appointmentId,appointment).then((approved)=>{
            res.json({state:true,message:"Appointment successfully approved.",details:approved});
        }).catch((err)=>{
            res.json({state:false,message:"Failed to approve appointment! Check your appointment.",err:err});
        });
    }).catch((err)=>{
        res.json({state:false,message:"Failed to approve appointment! Try again later.",err:err});
    });
})

module.exports = router;