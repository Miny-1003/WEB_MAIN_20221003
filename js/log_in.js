import {
  session_set,
  session_get_decrypted_pass,
  session_check,
} from "./session.js";
import { generateJWT, checkAuth } from "./jwt_token.js";
import { setCookie, getCookie } from "./cookie.js";
import { decrypt_text } from "./crypto2.js";
import { sanitizeInput, validateId, validatePassword } from "./validation.js";

document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

async function init() {
  // 로그인 폼에 쿠키에서 가져온 아이디 입력
  const idInput = document.getElementById("typeIdX");
  const idsave_check = document.getElementById("idSaveCheck");
  let get_id = getCookie("id");

  if (get_id) {
    idInput.value = get_id;
    idsave_check.checked = true;
  }
  // JWT 유효성 검사를 먼저 수행
  const jwt = localStorage.getItem("jwt_token");
  const sessionExists = sessionStorage.getItem("Session_Storage_id");

  if (jwt && sessionExists) {
    try {
      await checkAuth(); // JWT 유효한 경우만 리디렉션
      session_check({ redirectIfLoggedIn: true, redirectIfNotLoggedIn: false });

      await init_logined(); // 자동 로그인 시 복호화 정보 확인
    } catch (err) {
      console.warn("자동 로그인 실패: JWT 무효함");
      localStorage.removeItem("jwt_token"); // 무효한 경우 정리
    }
  }
}

// 로그인된 사용자 정보 복호화 후 콘솔/화면 출력
async function init_logined() {
  try {
    const decrypted = await session_get_decrypted_pass();
    console.log("복호화된 사용자 정보:", decrypted);

    // 사용자 환영 메시지 출력
    const welcomeEl = document.getElementById("welcome_user");
    if (welcomeEl && decrypted.id) {
      welcomeEl.textContent = `${decrypted.id}님 환영합니다!`;
    }
  } catch (e) {
    console.warn("복호화 실패:", e);
  }
}

// // 쿠키 세팅 함수
// function setCookie(name, value, expiredays) {
//   var date = new Date();
//   date.setDate(date.getDate() + expiredays);
//   document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +
//     "; expires=" + date.toUTCString() + "; path=/; SameSite=None; Secure";
// }

// // 쿠키 가져오기 함수
// function getCookie(name) {
//   const cookie = document.cookie;
//   console.log("쿠키를 요청합니다.");
//   if (cookie !== "") {
//     const cookie_array = cookie.split("; ");
//     for (let index in cookie_array) {
//       const cookie_name = cookie_array[index].split("=");

//       if (cookie_name[0].trim() === name) {
//         return cookie_name[1];
//       }
//     }
//   }
//   return null;
// }

// 로그인 실패 처리 및 차단 타이머
function login_failed() {
  let failCnt = safeParseInt(getCookie("login_fail_cnt"), 0);
  failCnt++;

  setCookie("login_fail_cnt", failCnt, 1); // 1일 동안 유지

  if (failCnt >= 5) {
    const now = new Date().getTime();
    setCookie("login_lock_time", now, 1); // 현재 시각 저장 (10분 제한 시작)

    alert(`로그인 실패 횟수: ${failCnt}/5회\n10분간 로그인이 제한됩니다.`);
  } else {
    alert(`로그인 실패 횟수: ${failCnt}/5회`);
  }
}

// NaN 방지용 안전 파싱 함수
function safeParseInt(value, defaultVal = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultVal : parsed;
}

// 로그인 횟수 증가
function login_count() {
  let cnt = safeParseInt(getCookie("login_cnt"), 0);
  cnt++;
  setCookie("login_cnt", cnt, 7);
  console.log("로그인 횟수:", cnt);
}

async function check_input() {
  const statusDiv = document.getElementById("loginStatus");
  const lockTime = parseInt(getCookie("login_lock_time"));
  const now = new Date().getTime();

  // 제한 중이면 메시지 출력 후 종료
  if (lockTime && now - lockTime < 3 * 60 * 1000) {
    const remain = Math.ceil((3 * 60 * 1000 - (now - lockTime)) / 1000);
    if (statusDiv) {
      statusDiv.innerText = `로그인 제한 중입니다. 남은 시간: ${remain}초`;
    }
    return false;
  }

  // 제한 종료 시 초기화
  if (lockTime && now - lockTime >= 3 * 60 * 1000) {
    setCookie("login_fail_cnt", 0, 1);
    setCookie("login_lock_time", "", 0);
    if (statusDiv) statusDiv.innerText = "";
  }

  const loginForm = document.getElementById("login_form");
  const loginBtn = document.getElementById("login_btn");
  const idInput = document.getElementById("typeIdX");
  const passwordInput = document.getElementById("typePasswordX");

  // 전역 변수 추가, 맨 위 위치
  const idsave_check = document.getElementById("idSaveCheck");

  console.log("아이디, 패스워드를 체크합니다");

  const idValue = idInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  const payload = {
    id: idValue,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  const jwtToken = generateJWT(payload);

  // XSS 검사
  const idSanitized = sanitizeInput(idValue);
  if (!idSanitized.valid) {
    alert(idSanitized.message);
    login_failed();
    return;
  }

  const pwSanitized = sanitizeInput(passwordValue);
  if (!pwSanitized.valid) {
    alert(pwSanitized.message);
    login_failed();
    return;
  }

  // 유효성 검사
  const idError = validateId(idSanitized.sanitized);
  if (idError) {
    alert(idError);
    login_failed();
    return;
  }

  const pwError = validatePassword(pwSanitized.sanitized);
  if (pwError) {
    alert(pwError);
    login_failed();
    return;
  }

  // 검사 마무리 단계 쿠키 저장, 최하단 submit 이전
  if (idsave_check.checked == true) {
    // 아이디 체크 o
    alert("쿠키를 저장합니다: " + idSanitized.sanitized);
    setCookie("id", idSanitized.sanitized, 1); // 1일 저장
    alert("쿠키 값 :" + idValue);
  } else {
    // 아이디 체크 x
    setCookie("id", idValue, 0); //날짜를 0 - 쿠키 삭제
  }

  console.log("아이디:", idSanitized.sanitized);
  console.log("비밀번호:", passwordValue);

  // 로그인 성공 처리
  login_count();
  // 로그인 성공 처리 후
  await session_set(); // 이 안에서 암호화됨
  setCookie("login_fail_cnt", 0, 1);
  localStorage.setItem("jwt_token", jwtToken);

  // session_set() 내부에서 암호화 저장 끝냄 -> 여기에 따로 encrypt_text 쓰지 않아도 됨
  await init_logined();
  loginForm.submit();
}

// 로그인 버튼 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login_btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault(); // submit 기본 동작 방지
      await check_input(); // 비동기 실행
    });
  }
});
