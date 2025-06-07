// 쿠키 설정
function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" +
        "; SameSite=None; Secure"; ;
}

// 쿠키 조회
function getCookie(name) {
    var cookie = document.cookie;
    if (cookie !== "") {
        var cookie_array = cookie.split("; ");
        for (var i = 0; i < cookie_array.length; i++) {
            var cookie_name = cookie_array[i].split("=");
            if (cookie_name[0] === name) {
                return cookie_name[1];
            }
        }
    }
    return;
}

// 팝업 열기
function pop_up() {
    var cookieCheck = getCookie("popupYN");
    if (cookieCheck !== "N") {
        // GitHub Pages에서 안정적으로 동작
        window.open("/Web_home_20221003/popup/popup.html", "팝업테스트", "width=400,height=300,top=10,left=10");
    }
}

// 페이지 로딩 후 팝업 열기
document.addEventListener("DOMContentLoaded", function () {
    // 팝업 내부에서는 실행 안 되도록 위치 체크
    if (!location.pathname.includes("/popup/")) {
        pop_up();
    }
});