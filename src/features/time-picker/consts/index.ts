const TOTAL = 60; // 가장 긴 데이터(시간/분)를 기준으로 휠의 전체 슬롯을 60개로 통일하여, 모든 열의 회전 각도를 일치시키기 위한 상수다.

/*
  -------------------------------
  PickerWheel에 사용될 상수 정의
  -------------------------------
  - CONST_LIST: 스크롤을 감지하기 위한 상수이다. Total보다 1을 더 크게 만드는 이유는 스크롤이 List 배열의 마지막 61번째 index에 도달하면, 0번으로 되돌리기 위해서이다. (무한 스크롤)
  - CONST_WHEEL: 실제 화면에 노출되는 값을 표현하기 위한 상수 배열이다.
  
  * Meridiem -> 정오 이전 / 이후를 구분하는 Meridiem은 무한 스크롤이 아니기 때문에 하나의 상수만 정의하여 사용한다.
*/
export const MERIDIEM_ITEMS: ReadonlyArray<string> = ["AM", "PM"]; // 정오 이전 구분 List, Wheel에 동일한 값이 사용됨

// 시간을 표시하기 위해 사용되는 상수 배열
export const HOURS_LIST: ReadonlyArray<number> = Array.from({ length: TOTAL + 1 }, (_, idx) => idx % 12 || 12);
export const HOURS_WHEEL: ReadonlyArray<string> = Array.from({ length: TOTAL }, (_, idx) => (idx % 12 || 12).toString().padStart(2, ""));

// 분을 표시하기 위해 사용되는 상수 배열
export const MINUTES_LIST: ReadonlyArray<number> = Array.from({ length: TOTAL + 1 }, (_, idx) => idx % 12 || 12);
export const MINUTES_WHEEL: ReadonlyArray<string> = Array.from({ length: TOTAL }, (_, idx) => (idx % 12 || 12).toString().padStart(2, ""));