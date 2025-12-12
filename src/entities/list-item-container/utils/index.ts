/**
 * 전달받은 문자열 매개변수를 분리하여 첫 번째 문자만 대문자로 변경해서 반환하는 유틸 함수
 * 
 * @param {string} str - 첫 번째 문자를 대문자로 변경할 문자열 데이터
 * @returns {string}
*/
export function capitalizeFirstChars(str: string): string {
  const splitedString = str.split("");
  splitedString[0] = splitedString[0].toUpperCase();
  return splitedString.join("");
}