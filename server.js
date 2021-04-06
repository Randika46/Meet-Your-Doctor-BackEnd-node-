const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));
app.use(express.urlencoded({extended:true}))

const url = "mongodb+srv://cyber_terrorist:meetyourdoctor@cluster0.qsmi3.mongodb.net/Meet_your_doctor_db?authSource=admin&replicaSet=atlas-vh7smg-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

var db = mongoose.connection;
db.once("open", () => {
    console.log("MongoDB connection successfull.");
});

var doctorRouter = require('./routes/doctor.js');
app.use('/doctor', doctorRouter);

var patientRouter = require('./routes/patient.js');
app.use('/patient', patientRouter);

var feedbackRouter = require('./routes/feedback.js');
app.use('/feedback', feedbackRouter);

var appointmentRouter = require('./routes/appointment.js');
app.use('/appointment', appointmentRouter);

var channelingRouter = require('./routes/channeling.js');
app.use('/channeling', channelingRouter);

var chatRouter = require('./routes/chat.js');
app.use('/chat', chatRouter);

var paymentRouter = require('./routes/payment.js');
app.use('/payment', paymentRouter);

var loginRouter = require('./routes/login.js');
app.use('/login', loginRouter);

var searchRouter = require('./routes/search.js');
app.use('/search',searchRouter);

app.listen(8080, () => {
    console.log("Server is running on 8080");
})