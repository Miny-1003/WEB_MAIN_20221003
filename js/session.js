import { encrypt_text, decrypt_text } from "./crypto2.js";

export async function session_set() {
  const session_id = document.querySelector("#typeIdX");
  const session_pass = document.querySelector("#typePasswordX");
  const timestamp = new Date().toISOString();

  const obj = {
    id: session_id.value,
    password: session_pass.value,
    otp: timestamp,
  };

  if (!sessionStorage) {
    alert("세션 스토리지를 지원하지 않습니다.");
    return;
  }

  const objString = JSON.stringify(obj);
  const encrypted = await encrypt_text(objString);
  sessionStorage.setItem("UserInfo_Encrypted", JSON.stringify(encrypted)); // 단일 키로 저장
  sessionStorage.setItem("Session_Storage_id", session_id.value);
}

// 단일 객체 복호화 방식으로 리팩토링된 함수
export async function session_get_decrypted_pass() {
  const encryptedStr = sessionStorage.getItem("UserInfo_Encrypted");
  if (!encryptedStr) return null;

  try {
    const encryptedObj = JSON.parse(encryptedStr);
    const decryptedJson = await decrypt_text(encryptedObj); // 복호화 수행
    return decryptedJson; // 객체 그대로 반환
  } catch (e) {
    console.warn("복호화 실패:", e);
    return null;
  }
}

// 리팩토링 핵심 함수
// 로그인 상태 체크 함수
export async function session_check({
  redirectIfLoggedIn = true,
  redirectIfNotLoggedIn = false,
} = {}) {
  const sessionExists = sessionStorage.getItem("Session_Storage_id");
  const jwt = localStorage.getItem("jwt_token");

  // 세션과 JWT가 모두 존재할 때만 로그인 상태로 간주
  if (sessionExists && jwt) {
    // 현재 페이지가 index_login.html이 아닌 경우에만 이동
    if (redirectIfLoggedIn && !location.pathname.includes("index_login.html")) {
      alert("이미 로그인 되어 있습니다.");
      location.href = "../login/index_login.html";
    }
  } else {
    // 로그인 안된 경우 옵션에 따라 처리
    if (redirectIfNotLoggedIn) {
      alert("로그인이 필요합니다.");
      location.href = "../index.html";
    }
  }
}

export function session_del() {
  if (sessionStorage) {
    sessionStorage.removeItem("Session_Storage_id");
    sessionStorage.removeItem("Session_Storage_pass");
    sessionStorage.removeItem("Session_Storage_object");
    sessionStorage.removeItem("Session_Key");
    alert("로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.");
  } else {
    alert("세션 스토리지 지원 x");
  }
}
