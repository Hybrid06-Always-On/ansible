const express = require('express');
const router = express.Router();
const responseUtil = require('../utils/responseUtil');

const thumbnailController = require('../controllers/thumbnailController');
const videoController = require('../controllers/videoController');

// 썸네일 목록 조회 라우팅
router.get('/api/thumbnails/:page', thumbnailController.getThumbnails);

// 영상 단일 조회 라우팅
router.get('/api/video/:id', videoController.getVideo);

module.exports = router;
