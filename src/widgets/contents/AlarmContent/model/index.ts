import type { Weekday } from "@entities/alarm";

/**
 * 전달받은 문자열 매개변수를 분리하여 첫 번째 문자만 대문자로 변경해서 반환하는 유틸 함수
 * 
 * @param {string} str - 첫 번째 문자를 대문자로 변경할 문자열 데이터
 * @returns {string}
*/
function capitalizeFirstChars(str: string): string {
  const splitedString = str.split("");
  splitedString[0] = splitedString[0].toUpperCase();
  return splitedString.join("");
}

/**
 * 사용자가 추가한 알림의 요일을 iOS 기반 타이머와 동일하게 문자열을 출력하기 위한 보조함수
 * 
 * @param {Weekday[]} weekdays - Clock 애플리케이션에서 설정한 주말 객체 구성 데이터
 * @returns {string}
*/
export function formatSelectedWeekdays(weekdays: Weekday[]): string {
  const selectedWeekdays = weekdays.map(weekdays => weekdays.stringValue).join("").toLowerCase();

  // 알림에 선택된 날짜를 연결한 문자열이 표현된 값에 따라 각각 다른 문자열을 보여주기 위한 조건식
  switch(selectedWeekdays) {
    case "sunsat": { // 1. 주말만 선택된 경우
      return "every weekend";
    }
    case "montuewedthufri": { // 2. 평일만 선택된 경우
      return "every weekday"
    }
    case "sunmontuewedthufrisat": { // 3. 모든 요일이 선택된 경우
      return "every day"
    }
    default: { // 4. 위 조건이 모두 일치하지 않는 경우
      if(weekdays.length === 1) {
        return capitalizeFirstChars(weekdays[0].stringValue);
      }
      
      let result = "";
      weekdays.forEach(({ stringValue }, idx) => {
        if(idx === weekdays.length - 1) {
          result += "and ";
        }

        result += capitalizeFirstChars(stringValue) + (idx === weekdays.length - 1 ? "" : ", ");
      });

      return result;
    }
  }
}