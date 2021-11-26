const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { DisLike } = require('../models/DisLike');

//=================================
//             Like
//=================================

// Like api
router.post('/getLikes', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  }
  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });
});

router.post('/getDisLikes', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  }
  DisLike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, dislikes });
  });
});

router.post('/upLike', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }
  const like = new Like(variable);
  like.save((err, likeResut) => {
    if (err) return res.json({ success: false, arr });

    DisLike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).send({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

router.post('/upDisLike', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }
  const dislike = new DisLike(variable);
  dislike.save((err, likeResut) => {
    if (err) return res.json({ success: false, arr });

    Like.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).send({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

router.post('/unLike', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).send({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post('/unDisLike', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  DisLike.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).send({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
