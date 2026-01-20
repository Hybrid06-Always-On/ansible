const ThumbnailStorage = require('./thumbnailStorage');
const minio = require('../config/minio');

class Thumbnail {
    constructor(body) {
        this.body = body;
    }

    // 썸네일 데이터 조회 비즈니스 로직
    async getThumbnails() {
        const { page } = this.body;

        // 400 Bad Request: 유효하지 않은 페이지 번호
        if (!page || isNaN(page) || parseInt(page) < 1) {
            return {
                code: 400,
                message: "잘못된 요청입니다. 유효한 페이지 번호를 입력해주세요."
            };
        }

        const ITEMS_PER_PAGE = 6;
        const p = parseInt(page, 10);
        const offset = (p - 1) * ITEMS_PER_PAGE;

        // Storage로부터 영상 데이터 조회
        let rows = await ThumbnailStorage.getVideos(ITEMS_PER_PAGE, offset);

        if (rows instanceof Error) {
            throw rows;
        }

        if (!rows) rows = [];
        else if (!Array.isArray(rows)) rows = [rows];

        // MinIO URL 생성 처리
        const thumbnails = await Promise.all(rows.map(async (row) => {
            if (row.thumbnail_path) {
                const thumbUrl = await minio.client.presignedGetObject(
                    minio.buckets.thumb,
                    row.thumbnail_path,
                    24 * 60 * 60 // 24 hours 유효
                );

                return {
                    id: row.id,
                    title: row.title,
                    image: thumbUrl
                };
            }
            return null;
        }));

        // 유효한 데이터만 필터링
        const validThumbnails = thumbnails.filter(item => item !== null);

        if (validThumbnails.length === 0) {
            return {
                code: 404,
                message: "해당 페이지에 대한 썸네일 데이터를 찾을 수 없습니다."
            };
        }

        return { code: 200, data: validThumbnails };
    }
}

module.exports = Thumbnail;