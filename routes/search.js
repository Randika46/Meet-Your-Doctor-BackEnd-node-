const router = require('express').Router();
const Doctor = require('../models/doctor');
const multer = require('multer');
const upload = multer();
router.route('/').post(upload.none(),async (req, res) => {
    
    
        const { name, location, speciality } = req.body;
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        
        
            const nameRgx = rgx(name);
            const nameFind = { name: { $regex: nameRgx, $options: "i" } };
        
            const locationRgx = rgx(location);
            const locationFind = { $or: [{ "address.province": { $regex: locationRgx, $options: "i" } }, { "address.district": { $regex: locationRgx, $options: "i" } }] };

            const specialityRgx = rgx(speciality);
            const specialityFind = { specialities: { $regex: specialityRgx, $options: "i" } };
        
        try{
            const doctors = await Doctor.find({
            $and: [
                nameFind,
                locationFind,
                specialityFind
            ]
        });
        if(!doctors.length)
        res.json({state:false,message:"No any matching Doctors found! Please make another search."});
        else
        res.json({state:true,details:doctors});
    } catch {
        res.json({ state: false, message: "Internal server error! Try again later." });
    }
})

module.exports = router;