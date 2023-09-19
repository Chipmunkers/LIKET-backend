//이름 정규표현식: 한글 2~4글자, 알파벳 2~6글자
export const nameRegExp = new RegExp(/^[가-힣]{2,4}|[a-zA-Z]{2,6}$/);

//아이디 정규표현식: 알파벳 또는 숫자 5~20글자
export const idRegExp = new RegExp(/^[a-z0-9]{5,20}$/);

//이메일 정규표현식
export const emailRegExp = new RegExp(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);

//비밀번호 정규표현식: 알파벳, 숫자, 특수 문자 8~20글자
export const pwRegExp = new RegExp(/^(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/);
