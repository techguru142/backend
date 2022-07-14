const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const multer = require('multer')
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(multer().any())
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://samirlohiya909:Lohiya123@samirlohiya.nszppy8.mongodb.net/group62Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("Connected with Nishant's MongoDB"))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
