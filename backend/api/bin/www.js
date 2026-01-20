const PORT = process.env.PORT || 3000;
const app = require("../app");

app.listen(PORT, () => {
    console.log(`${PORT}번 포트로 서버 가동 중`);
});