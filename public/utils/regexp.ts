// 이메일 정규식
export const RegexpEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 비밀번호 정규식
export const RegexpPassword: RegExp =
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/;
// 한글 정규식
export const RegexpHangul: RegExp = /^[가-힣]+$/;
// 닉네임 정규식
export const RegexpNickname: RegExp = /^[가-힣a-zA-Z0-9]{2,25}$/;
// 전화번호 정규식
export const RegexpPhone: RegExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
// YYYYMMDD 정규식
export const RegExpYYYYMMDD: RegExp =
  /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;

// input 알파벳과 숫자만
export const RegexpInputAlphabetAndNumber: RegExp = /[^a-zA-Z0-9]/gi;
// input 숫자 정규식
export const RegexpInputNumber: RegExp = /[^0-9]/gi;
// input 한글만
export const RegexpInputHangul: RegExp = /[^ㄱ-ㅎ가-힣]/gi;
