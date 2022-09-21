require('./config/config');
require('./models/db');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
var path = require('path');
const rtsIndex = require('./routes/index.router');
var Minio=require('minio')
var app = express();
var minioClient=new Minio.Client( {
    
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'minioadmin',
        secretKey: 'minioadmin'
    });

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);

//Static files_section
app.use(express.static(path.join(__dirname, 'public')))

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});
minioClient.bucketExists('minifb', function(err, exists) {
    if (err) {
      return console.log(err)
    }
    if (exists) {
      return console.log('Bucket exists.')
    }
  })
  
// start server
app.listen(process.env.PORT, () => console.log(`Status Server started at port : ${process.env.PORT}`));





