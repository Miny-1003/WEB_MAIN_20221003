import { session_del } from './session.js';
import { setCookie, getCookie } from './cookie.js';

// 로그아웃 횟수 증가 함수도 여기에
function logout_count() {
  let cnt = parseInt(getCookie("logout_cnt") || "0", 10);
  cnt++;
  setCookie("logout_cnt", cnt, 7); // 기존 쿠키 설정 함수 활용
  console.log("로그아웃 횟수:", cnt);
}

export function logout() {
  const autoLogoutChecked = document.getElementById("autoLogoutCheck")?.checked;

  if (autoLogoutChecked) {
    // 완전 로그아웃
    session_del();
    setCookie("id", "", 0); // ID 쿠키도 삭제
    localStorage.removeItem("jwt_token"); // JWT 삭제
    console.log("자동 로그인 세션 제거됨");
  } else {
    // 세션 유지, JWT 유지 → 자동 로그인 가능
    console.log("세션 유지, JWT 유지");
  }

  logout_count(); // 로그아웃 횟수 증가
  location.href = "../index.html";
}
