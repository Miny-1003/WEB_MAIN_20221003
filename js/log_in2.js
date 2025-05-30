import { session_get_decrypted_pass, session_check } from './session.js';
import { checkAuth } from './jwt_token.js';

// function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
//   const emailInput = document.getElementById('typeEmailX');
//   const idsave_check = document.getElementById('idSaveCheck');
//   let get_id = getCookie("id");
  
//   if(get_id) {
//     emailInput.value = get_id;
//     idsave_check.checked = true;
//   }
//   session_check(); // 세션 유무 검사
// }

// 로그인 후 메인화면용 초기화
async function init_logined() {
  if (!sessionStorage) {
    alert("세션 스토리지 지원 안됨");
    return;
  }

  const decrypted = await session_get_decrypted_pass();

  // 사용자 이름 표시
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay && decrypted?.id) {
    userDisplay.innerText = `${decrypted.id} 님`;
  }

  console.log("복호화된 비밀번호:", decrypted.password); // 확인용
}

// document.addEventListener('DOMContentLoaded', () => {
//   checkAuth();
//   init_logined();
// });

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();     // JWT 유효성 검사
  await session_check(); // 세션 존재 검사 (없으면 index.html로 리디렉션)
  await init_logined();  // 복호화해서 화면 표시
});
