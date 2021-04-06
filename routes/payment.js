const router = require('express').Router();
const Payment = require('../models/payment');
const multer = require('multer');
const upload = multer();

router.route('/add').post(upload.none(),(req,res)=>{
    const {amount,patientId,doctorId} = req.body;

    var newPayment = new Payment({
        amount,
        patientId,
        doctorId
    });

    newPayment.save().then((payment)=>{
        res.json({state:true,message:"Payment succesfull.",details:payment});
    }).catch((err)=>{
        res.json({state:false,message:"Payment failed! Please Try again later.",err:err});
    });
})

router.route('/').get((req,res)=>{
    Payment.find().then((payments)=>{
        res.json(payments);
    }).catch((err)=>{
        res.send(err);
    });
})

router.route('/update/:id').put(upload.none(),(req,res)=>{
    var paymentId = req.params.id;
    const {amount,patientId,doctorId} = req.body;
    var updatePayment = {
        amount,
        patientId,
        doctorId
    };
    Payment.findByIdAndUpdate(paymentId,updatePayment).then((update)=>{
        res.json({state:true,message:"Payment succesfully updated.",details:update});
    }).catch((err)=>{
        res.json({state:false,message:"Payment update failed! Please Try again later.",err:err});
    });
})

router.route('/delete/:id').delete((req,res)=>{
    var paymentId = req.params.id;
    Payment.findByIdAndDelete(paymentId).then((payment)=>{
        res.json({state:true,message:"Payment successfully deleted.",details:payment});
    }).catch((err)=>{
        res.json({state:false,message:"Payment delete failed! Please Try again later.",err:err});
    });
})

router.route('/:id').get((req,res)=>{
    var paymentId = req.params.id;
    Payment.findById(paymentId).then((payment)=>{
        res.json(payment);
    }).catch((err)=>{
        res.send(err);
    });
})

module.exports = router;