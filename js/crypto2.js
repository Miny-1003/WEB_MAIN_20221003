// AES-GCM을 위한 키 생성
async function generateKey() {
    return await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// 텍스트를 암호화 (AES-GCM)
async function encryptAES(plainText, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedText
    );

    // 암호문과 IV를 base64 문자열로 변환하여 리턴
    return {
        iv: btoa(String.fromCharCode(...iv)),
        data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    };
}

// 암호문 복호화
async function decryptAES(encryptedData, key) {
    const iv = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
    const data = new Uint8Array(atob(encryptedData.data).split('').map(c => c.charCodeAt(0)));

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );

    return new TextDecoder().decode(decrypted);
}