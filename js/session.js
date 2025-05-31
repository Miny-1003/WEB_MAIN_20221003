import { encrypt_text, decrypt_text } from "./crypto2.js";

export async function session_set() {
  //세션 저장
  let session_id = document.querySelector("#typeIdX");
  let session_pass = document.querySelector("#typePasswordX"); // DOM 트리에서 pass 검색
  let random = new Date(); // 랜덤 타임스탬프

  const obj = {
    // 객체 선언
    id: session_id.value,
    otp: random,
    password: session_pass.value, // password도 암호화 객체에 포함 (기존에는 단일 비번만 저장)
  };

  if (sessionStorage) {
    const objString = JSON.stringify(obj); // 객체 → 문자열 변환
    const encrypted = await encrypt_text(objString); // encrypt_text로 암호화

    sessionStorage.setItem("Session_Storage_id", session_id.value);
    sessionStorage.setItem("Session_Storage_object", objString);
    sessionStorage.setItem("Session_Storage_pass", JSON.stringify(encrypted));
  } else {
    alert("세션 스토리지 지원 x");
  }
}

// 세션 복호화된 비밀번호 반환
export async function session_get_decrypted_pass() {
  const encryptedData = JSON.parse(
    sessionStorage.getItem("Session_Storage_pass")
  ); // 키 이름 변경됨
  const decryptedObj = await decrypt_text(encryptedData); // decrypt_text는 내부에서 키 자동 처리
  return decryptedObj; // 반환값이 password가 아닌 객체 전체로 변경됨
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
