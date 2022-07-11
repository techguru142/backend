const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


<<<<<<< HEAD
mongoose.connect("mongodb+srv://nitinsayshe:eocJtbZ0u5pZhiKt@cluster0.tyswy.mongodb.net/newDb?retryWrites=true&w=majority", {
    useNewUrlParser: true   
=======
mongoose.connect("mongodb+srv://tech-guru:Job7563@cluster0.ivxxx.mongodb.net/group45Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
>>>>>>> 2d208e8f19a92ca2329aa00b73d4050a477b633f
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



app.use('/', route);
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});