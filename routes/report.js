var express = require('express');
var router = express.Router();
const Report = require('../models/mongo/report')

router.get('/',async(req,res)=>{
    try{
        const data = await Report.find({});
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json(err);
    }
})

router.put('/',async(req,res)=>{
    try{
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json(err);
    }
})

router.put('/:id/comment',async(req,res)=>{
    try{
        const newComment = req.body;
        const report = await Report.findById(req.params.id);
        await report.updateOne({$push: {comments: newComment}});
        res.status(200).json(newComment);
    }
    catch(err){
        res.status(500).json(err);
    }
})

router.put("/:id/upvote", async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (report.downvotes.includes(req.body.userId)) {
        await report.updateOne({ $pop: { downvotes: req.body.userId } });
      } 

      await report.updateOne({ $push: { upvotes: req.body.userId } });

      res.status(200).json("The post has been upvoted");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.put("/:id/downvote", async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (report.upvotes.includes(req.body.userId)) {
        await report.updateOne({ $pop: { upvotes: req.body.userId } });
      }
      await report.updateOne({ $push: { downvotes: req.body.userId } });
      res.status(200).json("The post has been downvoted");
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;