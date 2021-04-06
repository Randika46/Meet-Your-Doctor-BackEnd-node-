const router = require('express').Router();
const bcrypt = require('bcrypt');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const path = require('path');
const multer = require('multer');
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(null, false);
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.route('/add').post(upload.single('image'), async (req, res) => {
    try {
        await Doctor.findOne({ email: req.body.email }, async (err, doctor) => {
            if (err) throw err;
            if (!doctor) {
                await Patient.findOne({ email: req.body.email }, async (err, patient) => {
                    if (err) throw err;
                    if (!patient) {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(req.body.password, salt);
                        const { id, name, address, contactNumber, locations, email, password ,image } = req.body;
                        var newPatient = new Patient({
                            id,
                            name,
                            address,
                            contactNumber,
                            locations,
                            email,
                            password,
                            image
                        });
                        if(req.file){
                            newPatient.image = req.file.path;
                        }
                        newPatient.password = hashedPassword;

                        await newPatient.save().then((patient) => {
                            res.json({state:true,message:"Registration successfully completed.",details:patient});
                        }).catch((err) => {
                            res.json({state:false,message:"Something's wrong with adding the data! Try again later.",err:err});
                        });
                    }
                    else
                        res.json({ state: false, message: "E-mail is already registered! Please Try again with another E-mail." })
                })
            }
            else {
                res.json({ state: false, message: "E-mail is already registered! Please Try again with another E-mail." });
            }

        });

    } catch {
        res.status(500).send();
    }
})

router.route('/').get((req, res) => {
    Patient.find().then((patients) => {
        res.json(patients);
    }).catch((err) => {
        res.send(err);
    });
})

router.route('/update/:id').put(upload.single('image'),async(req, res) => {
    var patientId = req.params.id;
    const { id, name, address, contactNumber, locations, email, password , image } = req.body;
    var updatePatient = {
        id,
        name,
        address,
        contactNumber,
        locations,
        email,
        password,
        image
    };
    if(req.file){
        updatePatient.image = req.file.path;
    }
    Patient.findByIdAndUpdate(patientId, updatePatient).then((update) => {
        res.json({state:true,message:"Update successful.",details:update});
    }).catch((err) => {
        res.json({state:false,message:"Something's wrong with updating the data! Please Try again later.",err:err});
    });
})

router.route('/delete/:id').delete((req, res) => {
    var patientId = req.params.id;
    Patient.findByIdAndDelete(patientId).then((patient) => {
        res.json({state:true,message:"Delete successful.",details:patient});
    }).catch((err) => {
        res.json({state:false,message:"Something's wrong with deleting the data! Please Try again later.",err:err});
    });
})

router.route('/:id').get((req, res) => {
    var patientId = req.params.id;
    Patient.findById(patientId).then((patient) => {
        res.json(patient);
    }).catch((err) => {
        res.send(err);
    });
})

module.exports = router;