document.getElementById("search_btn_msg").addEventListener('click', search_message);

function search_message(){
    alert("검색을 수행합니다.");
} // 같은 이름의 함수가 중첩되어도 에러는 나지 않는다. 추가로 마지막에 정의된 함수가 우선순위가 더 높다.

function search_message() {
    let message = "검색 수행중";
    alert(message);
}

// const search_message = () => {
//     const c = '검색을 수행합니다';
//     alert(c);
//     };    

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value.trim(); // 입력값 앞뒤 공백 제거

    // 공백 또는 길이 0이면 중단
    if (searchTerm.length === 0) {
        alert("공백_재입력 요망");
        return false;
    }

    // 비속어 리스트
    const bannedWords = ["멍청이", "바보", "tq", "죽어", "ㅅㅂ"];

    // 비속어 포함 여부 검사
    for (let i = 0; i < bannedWords.length; i++) {
        if (searchTerm.includes(bannedWords[i])) {
            alert("비속어 포함_재입력 요망");
            return false;
        }
    }

    // 정상 검색 처리
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}
// 팝업 이벤트
function over(obj) {
    obj.src = "image/LOGO_VAL.png";
}

function out(obj) {
    obj.src = "image/LOGO_RIOT.png";
}
