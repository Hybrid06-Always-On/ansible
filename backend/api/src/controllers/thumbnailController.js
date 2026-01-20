const responseUtil = require('../utils/responseUtil');
const ThumbnailModel = require('../models/thumbnailModel');

module.exports = {
    // 썸네일 목록 조회 APIHandler
    getThumbnails: async (req, res) => {
        try {
            const thumbnail = new ThumbnailModel(req.params);
            const response = await thumbnail.getThumbnails();

            // 성공 또는 실패(4xx) 응답 반환
            return responseUtil.createResponse(res, {
                code: response.code,
                data: response.data,
                message: response.message || "성공"
            });

        } catch (err) {
            console.error("getThumbnails Error:", err);    // 디버깅용
            // 500 Internal Server Error
            return responseUtil.createResponse(res, {
                code: 500,
                message: "서버 내부 오류가 발생했습니다."
            });
        }
    }
};
