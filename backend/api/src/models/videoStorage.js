const db = require('../config/db');

class VideoStorage {
    // 영상 정보 단일 조회 (ID 기반)
    static async getVideo(id) {
        // id, 제목, 설명, 업로드 날짜, HLS 경로 조회
        const query = `
            SELECT id, title, description, created_date, hls_path 
            FROM videos 
            WHERE id = ?
        `;

        return await db.connection(query, [id]);
    }
}

module.exports = VideoStorage;
