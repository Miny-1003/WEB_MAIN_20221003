import { session_del } from './session.js';

// 로그아웃 횟수 증가 함수도 여기에
function logout_count() {
  let cnt = parseInt(document.cookie.match(/logout_cnt=(\d+)/)?.[1] || "0", 10);
  cnt++;
  document.cookie = `logout_cnt=${cnt}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=None; Secure`;
  console.log("로그아웃 횟수:", cnt);
}

export function logout() {
  const autoLogoutChecked = document.getElementById("autoLogoutCheck")?.checked;

  if (autoLogoutChecked) {
    session_del();
    document.cookie = "id=; max-age=0; path=/; SameSite=None; Secure";
    console.log("자동 로그인 세션 제거됨");
  }

  localStorage.removeItem('jwt_token');

  logout_count(); // 여기에 위치하면 딱 맞음
  location.href = "../index.html";
}