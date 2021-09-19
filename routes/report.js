var express = require('express');
var router = express.Router();
const report = require('../models/mongo/report')

router.get('/',async(req,res)=>{
    try{
        const data = await report.find({});
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json(err);
    }
})

router.put('/',async(req,res)=>{
    try{
        const newReport = new report(req.body);
        await newReport.save();
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;