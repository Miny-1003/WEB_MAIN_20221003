function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    var cookie = document.cookie;
    if (cookie !== "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] === name) {
                return cookie_name[1];
            }
        }
    }
    return;
}

function closePopup() {
    const checkbox = document.getElementById('check_popup');
    if (checkbox && checkbox.checked) {
        setCookie("popupYN", "N", 1);
        console.log("쿠키를 설정합니다.");
        window.close();
    }
}

// 카운트다운 자동 종료
let countdown = 300; // 초 단위, 원하는 시간으로 설정 가능
let countdownTimer;

function showCountdown() {
    const timeDiv = document.getElementById("Time");
    if (timeDiv) {
        timeDiv.innerText = `${countdown}초 후 창이 닫힙니다.`;
        countdown--;
        if (countdown >= 0) {
            countdownTimer = setTimeout(showCountdown, 1000);
        } else {
            window.close();
        }
    }
}

// 시계 표시 함수
function show_clock() {
    let currentDate = new Date();
    let divClock = document.getElementById('divClock');
    let msg = "현재 시간: ";
    if (currentDate.getHours() > 12) {
        msg += "오후 ";
        msg += currentDate.getHours() - 12 + "시 ";
    } else {
        msg += "오전 ";
        msg += currentDate.getHours() + "시 ";
    }
    msg += currentDate.getMinutes() + "분 ";
    msg += currentDate.getSeconds() + "초";

    divClock.innerText = msg;

    if (currentDate.getMinutes() > 58) {
        divClock.style.color = "red";
    } else {
        divClock.style.color = "black";
    }

    setTimeout(show_clock, 1000);
}

// DOM이 준비되면 시계와 카운트다운 시작
document.addEventListener("DOMContentLoaded", function () {
    show_clock();
    showCountdown();
});


// 팝업 이벤트
function over(obj) {
    obj.src = "image/LOGO_VAL.png";
}

function out(obj) {
    obj.src = "image/LOGO_RIOT.png";
}
