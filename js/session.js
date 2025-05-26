async function session_set() { //세션 저장
    let session_id = document.querySelector("#typeEmailX");
    let session_pass = document.querySelector("#typePasswordX"); // DOM 트리에서 pass 검색

    if (sessionStorage) {
        const key = await generateKey();
        const encrypted = await encryptAES(session_pass.value, key);

        sessionStorage.setItem("Session_Storage_id", session_id.value);
        sessionStorage.setItem("Session_Storage_pass2", JSON.stringify(encrypted));

        // 키 저장 : 일시 지정
        sessionStorage.setItem("Session_Key", JSON.stringify(await crypto.subtle.exportKey("jwk", key)));
    } else {
        alert("로컬 스토리지 지원 안됨");
    }
}

// function session_get() { //세션 읽기
//     if (sessionStorage) {
//         return sessionStorage.getItem("Session_Storage_pass");
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// 세션 복호화된 비밀번호 반환
async function session_get_decrypted_pass() {
    const encryptedData = JSON.parse(sessionStorage.getItem("Session_Storage_pass2"));
    const keyData = JSON.parse(sessionStorage.getItem("Session_Key"));

    const key = await crypto.subtle.importKey(
        "jwk",
        keyData,
        { name: "AES-GCM" },
        true,
        ["decrypt"]
    );

    const decrypted = await decryptAES(encryptedData, key);
    return decrypted;
}

// 세션 로그인 확인
async function session_check() {
    if (sessionStorage.getItem("Session_Storage_id")) {

        const decryptedPass = await session_get_decrypted_pass();
        console.log("복호화된 비밀번호:", decryptedPass); // ← 확인용

        alert("이미 로그인 되었습니다.");
        location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
    }
}

function session_del() {//세션 삭제
if (sessionStorage) {
    sessionStorage.removeItem("Session_Storage_id");
    sessionStorage.removeItem("Session_Storage_pass2");
    sessionStorage.removeItem("Session_Key");           // 키도 삭제
    alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

