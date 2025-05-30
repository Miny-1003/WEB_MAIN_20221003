export function setCookie(name, value, expiredays) {
  const date = new Date();
  date.setDate(date.getDate() + expiredays);
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +
    "; expires=" + date.toUTCString() + "; path=/; SameSite=None; Secure";
}

export function getCookie(name) {
  const cookie = document.cookie;
  if (cookie !== "") {
    const cookie_array = cookie.split("; ");
    for (let index in cookie_array) {
      const cookie_name = cookie_array[index].split("=");
      if (cookie_name[0].trim() === name) {
        return cookie_name[1];
      }
    }
  }
  return null;
}