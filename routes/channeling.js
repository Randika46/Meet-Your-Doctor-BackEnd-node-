const router = require('express').Router();
const Channeling = require('../models/channeling');
const multer = require('multer');
const upload = multer();

router.route('/add').post(upload.none(),(req,res)=>{
    const {appointmentId,date,time} = req.body;
    var newChanneling = new Channeling({
        appointmentId,
        date,
        time
    });
    newChanneling.save().then((channeling)=>{
        res.json({state:true,message:"Channeling adeded successfully completed.",details:channeling});
    }).catch((err)=>{
        res.json({state:false,message:"Something's wrong with adding the channel! Please Try again later.",err:err});
    });
})

router.route('/').get((req,res)=>{
    Channeling.find().then((channelings)=>{
        res.json({state:true,details:channelings});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/update/:id').put(upload.none(),(req,res)=>{
    var channelingId = req.params.id;
    const {appointmentId,date,time} = req.body;
    var updateChanneling = {
        appointmentId,
        date,
        time
    }
    Channeling.findByIdAndUpdate(channelingId,updateChanneling).then((update)=>{
        res.json({state:true,message:"Channeling successfully updated.",details:update});
    }).catch((err)=>{
        res.json({state:false,message:"Something's wrong with updating the channel! Please Try again later.",err:err});
    });
})

router.route('/delete/:id').delete((req,res)=>{
    var channelingId = req.params.id;
    Channeling.findByIdAndDelete(channelingId).then((channeling)=>{
        res.json({state:true,message:"Channeling successfully deleted.",details:channeling});
    }).catch((err)=>{
        res.json({state:false,message:"Something's wrong with deleting the channel! Please Try again later.",err:err});
    });
})

router.route('/:id').get((req,res)=>{
    var channelingId = req.params.id;
    Channeling.findById(channelingId).then((channeling)=>{
        res.json({state:true,details:channeling});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/doctor/:id').get((req,res)=>{
    var doctorId = req.params.id;
    Channeling.find({doctorId:doctorId}).then((channelings)=>{
        res.json({state:true,details:channelings});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/patient/:id').get((req,res)=>{
    var patientId = req.params.id;
    Channeling.find({patientId:patientId}).then((channelings)=>{
        res.json({state:true,details:channelings});
    }).catch((err)=>{
        res.json({state:false,err:err});
    })
})

module.exports = router;