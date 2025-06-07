// 쿠키 설정
function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +
                      "; expires=" + date.toUTCString() + "; path=/; SameSite=None; Secure";
}

// 쿠키 조회
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const item of cookies) {
        const [key, value] = item.split("=");
        if (decodeURIComponent(key) === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// 메인 페이지 시계
function show_clock() {
    const currentDate = new Date();
    const divClock = document.getElementById('divClock');

    let hours = currentDate.getHours();
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
    const period = hours >= 12 ? "오후" : "오전";
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    const msg = `현재 시간 : ${period} ${hours}시 ${minutes}분 ${seconds}초`;
    divClock.innerText = msg;

    divClock.style.color = currentDate.getMinutes() > 58 ? "red" : "black";

    setTimeout(show_clock, 1000);
}

// 팝업 열기
function pop_up() {
    const cookieCheck = getCookie("popupYN");
    if (cookieCheck !== "N") {
        window.open("../popup/popup.html", "팝업테스트", "width=400, height=300, top=10, left=10");
    }
}

// 팝업 내부: 카운트다운 자동 닫힘
let close_time;
let close_time2 = 1000;

clearTimeout(close_time);
close_time = setTimeout(close_window, 1000000);
show_time();

function show_time() {
    const divClock = document.getElementById('Time');
    if (divClock) {
        divClock.innerText = close_time2 + "초 후 창이 닫힙니다.";
        close_time2--;
        setTimeout(show_time, 1000);
    }
}

function close_window() {
    window.close();
}

// 팝업 내부: 다시 보지 않기 체크 시 쿠키 설정 + 닫기
function closePopup() {
    const checkbox = document.getElementById('check_popup');
    if (checkbox && checkbox.checked) {
        setCookie("popupYN", "N", 1);
        console.log("쿠키를 설정합니다.");
        self.close();
    }
}

// 팝업 이벤트
function over(obj) {
    obj.src = "image/LOGO_VAL.png";
}

function out(obj) {
    obj.src = "image/LOGO_RIOT.png";
}
