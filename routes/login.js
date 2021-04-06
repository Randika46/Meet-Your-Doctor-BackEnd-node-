const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();

router.route('/').post(upload.none(),async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    await Doctor.findOne({ email: email }, async (err, doctor) => {
        if (err) throw err;
        if (!doctor) {
            await Patient.findOne({ email: email }, async (err, patient) => {
                if (err) throw err;
                if (!patient) {
                    res.json({ state: false, message: "No user found!" });
                }
                else {
                    await bcrypt.compare(password, patient.password, (err, state) => {
                        if (state)
                            res.json({ state: true, message: "Logging successful.", details: patient });
                        else
                            res.json({ state: false, message: "Password Incorrect!" });
                    })
                }
            })
        }
        else {
            await bcrypt.compare(password, doctor.password, (err, state) => {
                if (err) throw err;
                if (state)
                    res.json({ state: true, message: "Logging successful.", details: doctor });
                else
                    res.json({ state: false, message: "Password Incorrect!" });
            })
        }
    })
})

module.exports = router;
