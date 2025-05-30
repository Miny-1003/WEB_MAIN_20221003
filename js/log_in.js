import { session_set, session_get_decrypted_pass, session_check, session_del } from './session.js';
import { encrypt_text, decrypt_text } from './crypto2.js';
import { generateJWT, checkAuth } from './jwt_token.js';
import { setCookie, getCookie } from './cookie.js';

document.addEventListener('DOMContentLoaded', async () => {
  await init();
});

async function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
  const emailInput = document.getElementById('typeEmailX');
  const idsave_check = document.getElementById('idSaveCheck');
  let get_id = getCookie("id");
  
  if(get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
  }
  // JWT 유효성 검사를 먼저 수행
  const jwt = localStorage.getItem('jwt_token');
  const sessionExists = sessionStorage.getItem("Session_Storage_id");

  if (jwt && sessionExists) {
    try {
      await checkAuth(); // JWT 유효한 경우만 리디렉션
      session_check({ redirectIfLoggedIn: true, redirectIfNotLoggedIn: false });
    } catch (err) {
      console.warn("자동 로그인 실패: JWT 무효함");
      localStorage.removeItem('jwt_token'); // 무효한 경우 정리
    }
  }
}


async function init_logined(){
if (sessionStorage) {
  const decrypted = await session_get_decrypted_pass();
  console.log("복호화된 비밀번호:", decrypted);
} else {
  alert("세션 스토리지 지원 x");
}
}

// XSS 필터링 유틸리티 함수
const check_xss = (input) => {
  const DOMPurify = window.DOMPurify;
  const sanitizedInput = DOMPurify.sanitize(input);
  if (sanitizedInput !== input) {
    alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
  }
  return sanitizedInput;
};

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
let failCnt = parseInt(getCookie("login_fail_cnt") || "0");
failCnt++;

setCookie("login_fail_cnt", failCnt, 1); // 1일 동안 유지

if (failCnt >= 3) {
  const now = new Date().getTime();
  setCookie("login_lock_time", now, 1); // 현재 시각 저장 (10분 제한 시작)

  alert(`로그인 실패 횟수: ${failCnt}회\n10분간 로그인이 제한됩니다.`);
} else {
  alert(`로그인 실패 횟수: ${failCnt}회`);
}
}

// NaN 방지용 안전 파싱 함수
function safeParseInt(value, defaultVal = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultVal : parsed;
}

// 로그인 횟수 증가
function login_count() {
  let cnt = parseInt(getCookie("login_cnt") || "0");
  cnt++;
  setCookie("login_cnt", cnt, 7);
  console.log("로그인 횟수:", cnt);
}

  // // 로그아웃 횟수 증가
  // function logout_count() {
  //   let cnt = parseInt(getCookie("logout_cnt") || "0");
  //   cnt++;
  //   setCookie("logout_cnt", cnt, 7);
  //   console.log("로그아웃 횟수:", cnt);
  // }

  // function logout() {
  // const autoLogoutChecked = document.getElementById("autoLogoutCheck")?.checked;

  // if (autoLogoutChecked) {
  //   session_del(); // 체크된 경우에만 세션 삭제
  //   setCookie("id", "", 0); // ID 쿠키도 삭제
  //   console.log("자동 로그인 세션 제거됨");
  // }

  // // JWT 토큰 삭제
  // localStorage.removeItem('jwt_token');

  // logout_count(); // 로그아웃 횟수 증가는 항상 실행
  // location.href = "../index.html";
  // }

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
  if (statusDiv) statusDiv.innerText = '';
}

  const loginForm = document.getElementById('login_form');
  const loginBtn = document.getElementById('login_btn');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');

  // 전역 변수 추가, 맨 위 위치
  const idsave_check = document.getElementById('idSaveCheck');


  const c = '아이디, 패스워드를 체크합니다';
  alert(c);

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  const payload = {
    id: emailValue,
    exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
  };
  const jwtToken = generateJWT(payload);

  // 유효성 검사
  if (emailValue === '') {
    alert('이메일을 입력하세요.');
    login_failed();
    return false;
  }

  if (passwordValue === '') {
    alert('비밀번호를 입력하세요.');
    login_failed();
    return false;
  }

  const sanitizedEmail = check_xss(emailValue);
  const sanitizedPassword = check_xss(passwordValue);
  if (!sanitizedEmail) {
    login_failed();
    return false;
  }
  if (!sanitizedPassword) {
    login_failed();
    return false;
  }

  // 기존 코드
  /*
  if (emailValue.length < 5) {
    alert('아이디는 최소 5글자 이상 입력해야 합니다.');
    return false;
  }
*/

  // 변경된 코드: 길이 제한 상한선 추가
  if (emailValue.length < 5 || emailValue.length > 10) {
    alert('아이디는 5자 이상 10자 이하로 입력해야 합니다.');
    login_failed();
    return false;
  }
  
  // 기존 코드
  /*
  if (passwordValue.length < 12) {
    alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
    return false;
  }
  */

  if (passwordValue.length < 12 || passwordValue.length > 15) {
    alert('비밀번호는 12자 이상 15자 이하로 입력해야 합니다.');
    login_failed();
    return false;
  }

  const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
  if (!hasSpecialChar) {
    alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
    login_failed();
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasLowerCase = /[a-z]/.test(passwordValue);
  if (!hasUpperCase || !hasLowerCase) {
    alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
    login_failed();
    return false;
  }

  // 추가된 코드: 3글자 이상 반복 문자열 금지
  const repeatPattern = /(.{3,})\1+/;
  if (repeatPattern.test(emailValue) || repeatPattern.test(passwordValue)) {
    alert('3글자 이상의 반복되는 문자열을 사용할 수 없습니다.');
    login_failed();
    return false;
  }

  // 추가된 코드: 2자리 숫자 반복 금지
  const doubleDigitRepeatPattern = /(\d{2})\1+/;
  if (doubleDigitRepeatPattern.test(emailValue) || doubleDigitRepeatPattern.test(passwordValue)) {
    alert('2자리 이상 연속되는 숫자 반복은 사용할 수 없습니다.');
    login_failed();
    return false;
  }

  // 검사 마무리 단계 쿠키 저장, 최하단 submit 이전
  if(idsave_check.checked == true) { // 아이디 체크 o
    alert("쿠키를 저장합니다.", emailValue);
    setCookie("id", emailValue, 1); // 1일 저장
    alert("쿠키 값 :" + emailValue);
  }

  else{ // 아이디 체크 x
    setCookie("id", emailValue, 0); //날짜를 0 - 쿠키 삭제
  }

  console.log('이메일:', emailValue);
  console.log('비밀번호:', passwordValue);

  // 로그인 성공 처리
  login_count();
  await session_set();
  setCookie("login_fail_cnt", 0, 1); // 성공 시 실패 횟수 초기화

  localStorage.setItem('jwt_token', jwtToken); // 로그인 성공 시 저장됨

  loginForm.submit();
};

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