export function sanitizeInput(input) {
  const DOMPurify = window.DOMPurify;
  const sanitized = DOMPurify.sanitize(input);
  if (sanitized !== input) {
    return { valid: false, message: "XSS 공격 가능성이 있는 입력값을 발견했습니다." };
  }
  return { valid: true, sanitized };
}

export function validateId(id) {
  const regex = /^[a-zA-Z0-9]{2,10}$/; // 2~10자 영문+숫자
  if (!regex.test(id)) {
    return "아이디는 영문자와 숫자 조합으로 2자 이상 10자 이하이어야 합니다.";
  }
  if (/(.{3,})\1+/.test(id)) {
    return "아이디에 3글자 이상 반복되는 문자열은 사용할 수 없습니다.";
  }
  if (/(\d{2})\1+/.test(id)) {
    return "아이디에 2자리 이상 반복되는 숫자는 사용할 수 없습니다.";
  }
  return null;
}

export function validatePassword(password) {
  if (password.length < 8 || password.length > 16) {
    return "비밀번호는 8자 이상 16자 이하이어야 합니다.";
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    return "비밀번호는 대문자와 소문자를 모두 포함해야 합니다.";
  }
  if (!/[0-9]/.test(password)) {
    return "비밀번호에 숫자가 포함되어야 합니다.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]/.test(password)) {
    return "비밀번호에 특수문자가 1개 이상 포함되어야 합니다.";
  }
  if (/(.{3,})\1+/.test(password)) {
    return "비밀번호에 3자 이상 반복되는 문자열은 사용할 수 없습니다.";
  }
  if (/(\d{2})\1+/.test(password)) {
    return "비밀번호에 2자리 이상 반복되는 숫자는 사용할 수 없습니다.";
  }
  return null;
}