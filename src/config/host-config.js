
// 백엔드 로컬서버 포트번호
const LOCAL_PORT = 8088;
// 백엔드 배포 서버 포트번호
const DEPLOY_PORT = 8088; 

/*
 현재 요청하는 브라우저의 host가 http://localhost:5173 이라면
 hostname은 localhost를 리턴
 만약 클라이언트가 https://www.naver.com 이면
 hostname은 www.naver.com을 리턴
*/
const clientHostName = window.location.hostname;

// 백엔드 호스트 조건부 처리
let backendHostName;

if (clientHostName ==='localhost') {
    backendHostName = `http://localhost:${LOCAL_PORT}`;
} else if (clientHostName === 'final-project-react-app-bucket-seong.s3-website.ap-northeast-2.amazonaws.com') {
    backendHostName = `http://43.202.28.18:${DEPLOY_PORT}`;
}

// 기본 백엔드 주소 저장
// 클라이언트가 localhost면
// http://localhost:8088
// 클라이언트가 final-project-react-app-bucket-seong.s3-website.ap-northeast-2.amazonaws.com라면
// http://43.202.28.18:8088
export const API_BASE_URL = `${backendHostName}`;

