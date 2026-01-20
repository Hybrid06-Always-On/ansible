const VideoStorage = require('./videoStorage');
const minio = require('../config/minio');

class Video {
    constructor(body) {
        this.body = body;
    }

    // 비디오 단일 데이터 조회 비즈니스 로직
    async getVideo() {
        const { id } = this.body;

        // 400 Bad Request: 유효하지 않은 ID
        if (!id || isNaN(id) || parseInt(id) < 1) {
            return {
                code: 400,
                message: "잘못된 요청입니다. 유효한 영상 ID 값을 입력해주세요."
            };
        }

        // Storage로부터 단일 영상 데이터 조회
        let row = await VideoStorage.getVideo(id);

        // 404 Not Found: 데이터 없음 또는 에러
        if (!row || row instanceof Error) {
            return {
                code: 404,
                message: "해당 ID 값의 영상 데이터를 찾을 수 없습니다."
            };
        }

        // MinIO HLS URL 생성 처리
        if (row.hls_path) {
            // HLS 파일에 대한 Presigned URL 생성 (24시간 유효)
            const hlsUrl = await minio.client.presignedGetObject(
                minio.buckets.hls,
                row.hls_path,
                24 * 60 * 60
            );

            // 날짜 포맷팅 (YYYY-MM-DD)
            const dateObj = new Date(row.created_date);
            const formattedDate = dateObj.toISOString().split('T')[0];

            return {
                code: 200,
                data: {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    upload_date: formattedDate,
                    video: hlsUrl
                }
            };
        }
    }
}


module.exports = Video;
