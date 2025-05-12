# HTML 프로젝트 - 깃허브
새로운 시작! 웹 서비스 개발의 세계로 떠나보아요~

## 개인 웹페이지 제작 시작(이름 : index_valorant.html)
This project is a starting point for a Web application.
- [프로젝트 메인 주소](https://github.com/Miny-1003/WEB_MAIN_20221003)

## 2주차 수업: 메인화면 개발 완료! (문제 포함)

- image 폴더 속 로고 이미지 index_valorant.html에 적용 (img src)
- 백그라운드 검정색으로 수정 (body style)
- 텍스트 메뉴 제작 (게임정보, 미디어, 소식, 고객지원 등등) (div)
- 메인 로비 화면 제작 (div, img src)
- 하단 텍스트 추가 완료 (Riot Games Company...) (div, h3)

## 3주차 수업: 부트스트랩 적용 완료! (문제 포함) 

part1.
- 문서 저자정보 설정과 ID지정, 검색엔진 최적화, 상대경로 기준 URL 정의
- 메인 로비 이미지 속에 하이퍼 링크(="https://playvalorant.com/ko-kr/") 삽입 (a href)
- table 제작 (표 제목: 인기 캐릭터) (caption, tr, td, colspan 활용)
- 표 색 지정 (1행: skyblue, 2행: grey, 3행: pink)
- 표 수정 grey열 5행 합성 후 하이퍼 링크 삽입 (응용 문제)
- pink 열 캐릭터 이미지 삽입 (응용 문제)

part2.
- meta viewport 적용(반응형 웹디자인 기초 작업)
- Popper.js(드롭다운에 필요)와 Bootstrap JS를 CDN으로 불러오는 코드 작성
- 부트스트랩 접속 후 nav 코드 긁어서 index_valorant.html에 적용
- 기존 텍스트 메뉴 삭제 후 nav 코드 속에 재작성
- 메뉴 드롭다운 일부(고객지원) 적용 (연습문제)
- nav 색상 검정색으로 변경 (연습문제)
- 테이블 다양한 색상 적용 (연습문제)

<문제상황 및 대처>
- 드롭다운 기능이 작동하지 않는 문제 발생 -> popper.js 추가 후 성공

## 4주차 수업: 네비게이션 바 및 테이블 개선 완료! (문제 포함)

part1.
- 로고 이미지 nav 속으로 이동(배경색 삭제)
- <div class="container-fluid"> 적용 (반응형 웹디자인)
- 메인 로비 이미지 속(img 내부 속성) class="img-fluid" 적용
- table 부트스트랩 스타일로 전체 수정 (thead, th 사용) (속성값: class=“table") (반응형 웹디자인 추가)
- 메뉴 드롭다운 일부(고객지원) 하이퍼링크 적용 (응용 문제)
- 부트스트랩 타입 table 색상 적용 (응용 문제)

part2.
- js 폴더 생성 및 basic_text.js 작성 후 <head> 태그에 <script> 태그로 삽입.
    <!-- <script type="text/javascript" src="js/basic_js_test.js"></script> -->
- var, const, let 변수명 사용법 익히기
- 개발자 모드(F12)를 통해 콘솔 출력 후 확인
- nav에 검색창 추가 (부트스트랩 - 컴포넌트)
- 검색 기능 구현
    - search.js 작성(.getElementById, addEventListener, function, alert) 후 <head> 태그에 <script> 태그로 삽입.
    - 검색창 버튼(속이 색칠 되지 않은) 기능 구현 (button class, id, type="submit") (id가 같아야 작동)
    - defer 속성 추가(search.js)
- 클릭이벤트 식별자 변경해보기 (스크립트와 index_valorant.html 둘다) (연습 문제)
- 같은 이름의 함수 중첩해보기 (연습 문제)
    - 같은 이름의 함수가 중첩되어도 에러는 나지 않는다. 추가로 마지막에 정의된 함수가 우선순위가 더 높다.
- 함수에 변수를 추가해 변수를 출력하도록 변경 (연습 문제)

## 5주차 수업: 팝업창 및 검색창 구현 완료
- 비속어 검사 포함
## 6주차 수업: 팝업창 발전 및 로그인창 구현 완료 (공백 포함 / 로그아웃 포함)

## 9주차 수업:
- 로그인폼 입력 길이와 특수문자 포함 코드 작성(log_in.js 코드 수정)
- XSS 방지 코드 추가
- 응용문제 풀이 완료
- 체크박스 닫기 적용 완료
- 보안 관련 코드 적용
