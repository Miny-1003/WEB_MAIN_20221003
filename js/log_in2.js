import { session_get_decrypted_pass, session_check } from './session.js';
import { checkAuth } from './jwt_token.js';
console.log(localStorage.getItem('jwt_token'));
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
    userDisplay.innerHTML = `<span class="text-danger">${decrypted.id} </span> 님`;
  }

  console.log("복호화된 비밀번호:", decrypted.password); // 확인용
}

document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. "사용자 정보" 버튼 클릭 시 profile.html로 이동
  const profileBtn = document.getElementById("goProfile");
  if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "profile.html";
    });
  }

  // 2. 로그인 상태 확인 및 사용자 표시
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay) {
    await checkAuth(); // JWT 유효성 검사
    await session_check({
      redirectIfLoggedIn: false,
      redirectIfNotLoggedIn: true
    });
    await init_logined(); // 복호화한 사용자 정보 표시
  }
});
