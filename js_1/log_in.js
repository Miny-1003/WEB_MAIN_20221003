const check_xss = (input) => {
  const DOMPurify = window.DOMPurify;
  const sanitizedInput = DOMPurify.sanitize(input);
  if (sanitizedInput !== input) {
    alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
  }
  return sanitizedInput;
};

const check_input = () => {
  const loginForm = document.getElementById('login_form');
  const loginBtn = document.getElementById('login_btn');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');

  const c = '아이디, 패스워드를 체크합니다';
  alert(c);

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  if (emailValue === '') {
    alert('이메일을 입력하세요.');
    return false;
  }

  if (passwordValue === '') {
    alert('비밀번호를 입력하세요.');
    return false;
  }

  const sanitizedEmail = check_xss(emailValue);
  const sanitizedPassword = check_xss(passwordValue);
  if (!sanitizedEmail) {
    return false;
  }
  if (!sanitizedPassword) {
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
    return false;
  }

  const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
  if (!hasSpecialChar) {
    alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasLowerCase = /[a-z]/.test(passwordValue);
  if (!hasUpperCase || !hasLowerCase) {
    alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
    return false;
  }

  // 추가된 코드: 3글자 이상 반복 문자열 금지
  const repeatPattern = /(.{3,})\1+/;
  if (repeatPattern.test(emailValue) || repeatPattern.test(passwordValue)) {
    alert('3글자 이상의 반복되는 문자열을 사용할 수 없습니다.');
    return false;
  }

  // 추가된 코드: 2자리 숫자 반복 금지
  const doubleDigitRepeatPattern = /(\d{2})\1+/;
  if (doubleDigitRepeatPattern.test(emailValue) || doubleDigitRepeatPattern.test(passwordValue)) {
    alert('2자리 이상 연속되는 숫자 반복은 사용할 수 없습니다.');
    return false;
  }

  console.log('이메일:', emailValue);
  console.log('비밀번호:', passwordValue);
  loginForm.submit();
};

document.getElementById("login_btn").addEventListener('click', check_input);
