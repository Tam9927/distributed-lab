const mongoose = require('mongoose');
const _ = require('lodash');
const Minio = require('minio');
const story = require('../models/story');
const crypto = require('crypto');
const path = require("path");
// Get story using minIO

module.exports.CreateStory = (async (req, res) => { 

    const minioClient = minio();

    //PutObject(bucketName, objectName, stream, size, metaData[, callback])
    const filepath = path.join('/home/tahmeed/Step-2/Minifb/storyMS/image/',req.file.filename);
    var uuidName = crypto.randomUUID();
    console.log(req.file.filename)
    console.log(filepath)
    minioClient.fPutObject('minifb', uuidName, req.file.path, function (err, objInfo) {

        if (err) {
            return console.log('minioerror: ',err)
        }
        console.log('success')
    });
 
    // minioClient.fPutObject('minifb', uuidName, filePath, function (err, objInfo) {

    //     if (err) {
    //         return console.log(err)
    //     }
    // });


    //Create a new story
    const newStory = new story({
        name: req.body.name,
        storyUUID: uuidName
    });

    try {
        const savedStory = await newStory.save();
        res.send({ story: 'Uploaded Successfully' });
    } catch (err) {
        res.status(400).send(err);
    }
});

exports.getStory = (async (req,res) =>{
    try{
        const allStory = await story.find().sort({"time":-1}).limit(10);       
        res.send(allStory);
    } catch(err){
        res.status(400).send({Fail: 'Image not found'});
    }
});

function minio() {
    return new Minio.Client({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'Q7t4zpTL1sR4L8q2',
        secretKey: '0C9uSqxpJmemsY6HI5akirVpyuj3HNy8'
    });
}