const VideoModel = require('../models/videoModel');
const responseUtil = require('../utils/responseUtil');

module.exports = {
    // 비디오 단일 조회 APIHandler
    getVideo: async (req, res) => {
        try {
            const video = new VideoModel(req.params);
            const response = await video.getVideo();

            // 성공 또는 실패(4xx) 응답 반환
            return responseUtil.createResponse(res, {
                code: response.code,
                data: response.data,
                message: response.message || "성공"
            });

        } catch (err) {
            console.error("getVideoList Error:", err);    // 디버깅용
            // 서버 에러(500) 응답 반환 
            return responseUtil.createResponse(res, {
                code: 500,
                message: "서버 내부 오류가 발생했습니다."
            });
        }
    }
};
