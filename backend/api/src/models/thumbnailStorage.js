const db = require('../config/db');

// 썸네일 이미지 조회
class ThumbnailStorage {
    static async getVideos(limit, offset) {
        const query = `
            SELECT id, title, thumbnail_path 
            FROM videos 
            ORDER BY id ASC 
            LIMIT ? OFFSET ?
        `;

        return await db.connection(query, [limit, offset]);
    }
}

module.exports = ThumbnailStorage;
