// 모듈
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const client = require('prom-client'); // Prometheus 클라이언트 모듈

const app = express();
dotenv.config();

// Default Metrics 수집 (CPU, Memory 등)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// 라우팅
const router = require("./src/routes");

// 미들웨어
app.use(cors({
    origin: true,
    credentials: false
}));
// morgan 설정
app.use(
  morgan((tokens, req, res) => {
    const status = Number(tokens.status(req, res));

    let level = 'info';
    if (status >= 500) level = 'error';
    else if (status >= 400) level = 'warn';

    return JSON.stringify({
      ts: Date.now(),              // epoch ms (Loki timestamp)        
      level,                       // info | warn | error (로그 레벨)        
      method: tokens.method(req, res),  // HTTP Method
      url: tokens.url(req, res),        // 요청 경로
      status,                           // 응답 상태 코드
      duration_ms: Number(tokens['response-time'](req, res)),  // 응답 처리 시간 (ms)
    });
  })
);
// Custom Metric: 현재 동시 연결 수 Gauge
const activeRequestsGauge = new client.Gauge({
    name: 'http_active_conn',
    help: 'Number of active HTTP connections',
});

// Middleware: 요청 시작 시 증가, 종료 시 감소
app.use((req, res, next) => {
    activeRequestsGauge.inc();
    res.on('finish', () => {
        activeRequestsGauge.dec();
    });
    next();
});

// JSON, URL 인코딩 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

// Metrics 엔드포인트
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    
    // 전체 메트릭 가져오기
    const allMetrics = await client.register.metrics();

    // 필터링할 메트릭 이름 목록
    const allowedMetrics = [
        'process_cpu_seconds_total',      // CPU 사용량
        'process_resident_memory_bytes',  // 메모리 사용량 (RSS)
        'nodejs_eventloop_lag_seconds',   // 이벤트 루프 지연
        'http_active_conn'                // 동시 연결 수 (Custom)
    ];

    // 라인 단위로 필터링
    const filteredMetrics = allMetrics.split('\n').filter(line => {
        // 주석(# HELP, # TYPE) 또는 허용된 메트릭 이름으로 시작하는 줄 포함
        return allowedMetrics.some(metric => line.startsWith(metric) || line.includes(metric));
    }).join('\n');

    res.end(filteredMetrics);
});

module.exports = app;