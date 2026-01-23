const db = require('../config/db');

// 썸네일 이미지 조회
class ThumbnailStorage {
    static async getVideos(limit = 6, offset = 0) {
        const query = `
            SELECT id, title, thumbnail_path
            FROM videos
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;

        return await db.connection(query, [limit, offset]);
    }
}

module.exports = ThumbnailStorage;