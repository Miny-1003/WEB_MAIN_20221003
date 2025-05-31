import { encrypt_text } from "./crypto2.js";
import { sanitizeInput, validateId, validatePassword } from "./validation.js";

// 정규표현식 정의
const idRegex = /^[a-zA-Z0-9]{4,15}$/; // 영문/숫자 조합, 4~15자
const nameRegex = /^[가-힣]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// 회원가입 실행 함수
async function join() {
  let form = document.querySelector("#join_form");
  let userId = document.querySelector("#form3Example0c"); // 아이디
  let name = document.querySelector("#form3Example1c");
  let email = document.querySelector("#form3Example3c");
  let password = document.querySelector("#form3Example4c");
  let re_password = document.querySelector("#form3Example4cd");
  let agree = document.querySelector("#form2Example3c");

  // XSS 검사
  const fields = [userId, name, email, password, re_password];
  for (let field of fields) {
    const result = sanitizeInput(field.value);
    if (!result.valid) {
      alert(result.message);
      return;
    }
    field.value = result.sanitized; // 정제된 값으로 덮어쓰기
  }

  // 빈칸 검사
  if (
    !userId.value ||
    !name.value ||
    !email.value ||
    !password.value ||
    !re_password.value
  ) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  // 아이디 유효성 검사
  const idError = validateId(userId.value);
  if (idError) {
    alert(idError);
    userId.focus();
    return;
  }

  // 이름 유효성 검사
  if (!nameRegex.test(name.value)) {
    alert("이름은 한글만 입력 가능합니다.");
    name.focus();
    return;
  }

  // 이메일 형식 검사
  if (!emailRegex.test(email.value)) {
    alert("이메일 형식이 올바르지 않습니다.");
    email.focus();
    return;
  }

  // 비밀번호 유효성 검사
  const pwError = validatePassword(password.value);
  if (pwError) {
    alert(pwError);
    password.focus();
    return;
  }

  // 비밀번호 일치 검사
  if (password.value !== re_password.value) {
    alert("비밀번호가 일치하지 않습니다.");
    re_password.focus();
    return;
  }

  // 약관 동의 확인
  if (!agree.checked) {
    alert("약관에 동의하셔야 가입이 가능합니다.");
    return;
  }

  // // 회원가입 정보 객체 정의
  // class SignUp {
  //   constructor(userId, name, email, password, re_password) {
  //     this._id = userId;
  //     this._name = name;
  //     this._email = email;
  //     this._password = password;
  //     this._re_password = re_password;
  //   }

  //   setUserInfo(userId, name, email, password, re_password) {
  //     this._id = userId;
  //     this._name = name;
  //     this._email = email;
  //     this._password = password;
  //     this._re_password = re_password;
  //   }

  //   getUserInfo() {
  //     return {
  //       id: this._id,
  //       name: this._name,
  //       email: this._email,
  //       password: this._password,
  //       re_password: this._re_password,
  //     };
  //   }
  // }

  // 모든 유효성 검사를 통과한 경우
  const userObj = {
    id: userId.value,
    name: name.value,
    email: email.value,
    password: password.value,
  };

  const encrypted = await encrypt_text(JSON.stringify(userObj)); // 암호화
  sessionStorage.setItem("SignUp_Info", JSON.stringify(encrypted)); // 암호화된 정보 저장

  form.action = "../index.html";
  form.method = "get";
  form.submit();
}

// 이벤트 연결
document.getElementById("join_btn").addEventListener("click", join);
