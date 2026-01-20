const Minio = require("minio");

// MinIO 클라이언트 생성
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

// MinIO 모듈화
module.exports = {
    client: minioClient,
    buckets: {
        hls: process.env.MINIO_BUCKET_HLS,
        thumb: process.env.MINIO_BUCKET_THUMB
    }
};
