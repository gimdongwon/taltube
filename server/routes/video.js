const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');
const ffmpeg = require('fluent-ffmpeg');

const { auth } = require('../middleware/auth');
const multer = require('multer');
const { Subscriber } = require('../models/Subscriber');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
    }
    cb(null, true);
  },
});
var upload = multer({ storage: storage }).single('file');

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  // video 를 서버에 저장
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/thumbnail', (req, res) => {
  // ㅂ비디 정ㅗ 가져오기
  let thumbsFilePath = '';
  let fileDuration = '';

  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  // thumbnail 생성
  ffmpeg(req.body.filePath)
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '));
      thumbsFilePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3, // 3개의 썸네일
      folder: 'uploads/thumbnails', // 파일 저장 위치
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png',
    });
});

router.post('/uploadVideo', (req, res) => {
  const video = new Video(req.body);

  video.save((err, video) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.get('/getVideos', (req, res) => {
  // video를 db에서 가져와서 클라이언트에 보냄.
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post('/getVideoDetail', (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

// 구독한 영상 가져오는 api
router.post('/getSubscriptionVideos', (req, res) => {
  // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
  Subscriber.find({ userTo: req.body.userFrom }).exec((err, subscriberInfo) => {
    if (err) return res.status(400).send(err);
    let subscribedUser = [];
    subscriberInfo.map((item, i) => {
      subscribedUser.push(item.userTo);
    });
    // 찾은 사람들의 비디오를 가져온다.
    Video.find({ writer: { $in: subscribedUser } }) // $in이라는 새로운 기능 // 들어있는 모든사람들의 아이디를 찾을 수 있음.
      .populate('writer')
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({ success: true, videos });
      });
  });
});

module.exports = router;
