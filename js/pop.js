function setCookie(name, value, expiredays) {
  var date = new Date();
  date.setDate(date.getDate() + expiredays);
  document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function closePopup() {
  const checkbox = document.getElementById('check_popup');
  if (checkbox && checkbox.checked) {
    setCookie("popupYN", "N", 1);
    console.log("쿠키 설정 완료");
    window.close();
  }
}

function show_clock() {
  const divClock = document.getElementById('divClock');
  if (!divClock) return;

  const now = new Date();
  let msg = "현재 시간: ";
  let h = now.getHours();
  let period = h >= 12 ? "오후" : "오전";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  msg += `${period} ${h}시 ${now.getMinutes()}분 ${now.getSeconds()}초`;

  divClock.innerText = msg;
  divClock.style.color = now.getMinutes() > 58 ? "red" : "black";

  setTimeout(show_clock, 1000);
}

// 카운트다운 종료
let countdown = 10;
function showCountdown() {
  const timeDiv = document.getElementById("Time");
  if (!timeDiv) return;

  timeDiv.innerText = `${countdown}초 후 창이 닫힙니다.`;
  if (countdown > 0) {
    countdown--;
    setTimeout(showCountdown, 1000);
  } else {
    window.close();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  show_clock();
  showCountdown();
});
