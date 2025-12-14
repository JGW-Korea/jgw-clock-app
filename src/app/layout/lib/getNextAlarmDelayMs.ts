/**
 * 설정한 요일 중 현재 시간 기준 가장 빠른 요일에 대한 밀리초 값을 반환하는 보조 함수 
 * 
 * @param {number} hours      - 설정된 알림 시간(hours)
 * @param {number} minutes    - 설정된 알림 분(minuts)
 * @param {number[]} weekdays - 설정된 알림 요일(weekday)
 * @returns {number}          - setTimeout 두 번째 인자에 붙일 밀리초 값
*/
export function getNextAlarmDelayMs(hours: number, minutes: number, weekdays: number[]): number {
  if(weekdays.length === 0) weekdays = Array.from({ length: 7 }, (_, idx) => idx); // 설정된 알림에서 아무 요일도 선택하지 않은 경우 Everyday와 동일시 취급한다.

  const date = new Date(); // 현재 시간을 가지고 온다.

  // 알림에 설정 값을 바탕으로 현재 시간 기준 밀리초 비교값을 구한다.
  const temp = [];
  for(const weekday of weekdays) {
    // 오늘 기준으로 며칠 뒤의 알림인지 계산하고, 만약 음수값이 나오면 현재 요일 기준 뒤에 있는 날짜를 의미한다.
    let diffDay = weekday - date.getDay();
    if(diffDay < 0) {
      diffDay += 7;
    }

    // 현재 시간을 기준으로 설정된 알림의 차이를 계산한다.
    const target = new Date(date);
    target.setDate(date.getDate() + diffDay);
    target.setHours(hours, minutes, 0, 0);

    // 요일은 오늘이지만, 이미 시간이 지난 경우에는 다음 주로 처리한다.
    if(target.getTime() <= date.getTime()) {
      target.setDate(target.getDate() + 7);
    }

    temp.push(target.getTime()); // 목표 날짜 값의 밀리초로 변환하여 해당 값을 저장한다.
  }

  return Math.min(...temp) - date.getTime(); // 설정한 요일에서 가장 현재 시간 기준으로 짧은 밀리초를 반환한다.
}
