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
})
const upload = multer({ storage: storage, fileFilter: fileFilter });


router.route('/add').post(upload.single('image'), async (req, res) => {
    try {
        await Patient.findOne({ email: req.body.email }, async (err, patient) => {
            if (err) throw err;
            if (!patient) {
                await Doctor.findOne({ email: req.body.email }, async (err, doctor) => {
                    if (err) throw err;
                    if (!doctor) {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(req.body.password, salt);
                        const { name, id, channelingCentre, address, hospital, nursingHome, qualifications, rating, noOfRaters, specialities, contactNumber, email, password ,image ,workingHours, workingDays} = req.body;
                        var newDoctor = new Doctor({
                            name,
                            id,
                            channelingCentre,
                            address,
                            hospital,
                            nursingHome,
                            qualifications,
                            rating,
                            noOfRaters,
                            specialities,
                            contactNumber,
                            email,
                            password,
                            image,
                            workingHours,
                            workingDays
                        });
                        if(req.file){
                            newDoctor.image = req.file.path;
                        }
                        newDoctor.password = hashedPassword;

                        await newDoctor.save().then((doctor) => {
                            res.json({state:true,message:"Registration succesfully completed.",details:doctor});
                        }).catch((err) => {
                            res.json({state:false,message:"Something's wrong with your registration! Try again later.",err:err});
                        });
                    }
                    else
                        res.json({ state: false, message: "E-mail is already registered! Please try again with another E-mail." })
                })
            }
            else
                res.json({ state: false, message: "E-mail is already registered! Please try again with another E-mail." });
        });

    } catch {
        res.status(500).send();
    }

})

router.route('/').get(async (req, res) => {
    await Doctor.find().then((doctors) => {
        res.json(doctors);
    }).catch((err) => {
        res.send(err);
    })
})

router.route('/update/:id').put(upload.single('image'),async (req, res) => {
    const doctorId = req.params.id;
    const { name, id, channelingCentre, address, hospital, nursingHome, qualifications, rating, noOfRaters, specialities, contactNumber, email, password, image , workingHours, workingDays } = req.body;
    var updateDoctor = {
        name,
        id,
        channelingCentre,
        address,
        hospital,
        nursingHome,
        qualifications,
        rating,
        noOfRaters,
        specialities,
        contactNumber,
        email,
        password,
        image,
        workingHours,
        workingDays
    };
    if(req.file){
        updateDoctor.image = req.file.path;
    }
    await Doctor.findByIdAndUpdate(doctorId, updateDoctor).then((update) => {
        res.json({state:true,message:"Update successful.",details:update});
    }).catch((err) => {
        res.json({state:false,message:"Something's wrong with updating the data!",err:err});
    });
})

router.route('/delete/:id').delete((req, res) => {
    var doctorId = req.params.id;
    Doctor.findByIdAndDelete(doctorId).then((deleteDoctor) => {
        res.json({state:true,message:"Delete successful.",details:deleteDoctor});
    }).catch((err) => {
        res.json({state:false,message:"Something's wrong with deleting the data!",err:err});
    });
})

router.route('/getDoctorsByLocation/:location').get(async (req, res) => {

    const location = req.params.location;

    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

    const searchRgx = rgx(location);

    try {
        const doctors = await Doctor.find().or([
            { "address.province": { $regex: searchRgx, $options: "i" } },
            { "address.district": { $regex: searchRgx, $options: "i" } }
        ]);
        res.send(doctors);
    } catch (err) {
        res.status(500).send(err.message || 'Internal Server Error!')
    }
})

router.route('/:id').get(async (req, res) => {
    var doctorId = req.params.id;
    await Doctor.findById(doctorId).then((doctor) => {
        res.json(doctor);
    }).catch((err) => {
        res.send(err);
    });
})

module.exports = router;