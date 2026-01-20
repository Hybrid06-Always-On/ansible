module.exports = {
    // API 응답 데이터를 생성하는 함수
    createResponse: (res, response) => {
        const { code, data } = response;
        const message = code !== 500 ? response.message : "서버 에러 발생";

        // 성공 응답: HTTP 상태 코드가 2xx 범위일 경우, 성공 데이터 반환
        // 실패 응답: 그 외의 경우, 에러 메시지를 포함한 응답 반환
        const jsonResponse = code >= 200 && code < 300
            ? { success: data ?? null, error: null }        // data가 undefined일 경우 null로 설정
            : { success: null, error: { message: message } };

        return res.status(code).json(jsonResponse);
    },
};