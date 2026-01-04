/**
 * Timer 시작 중에 다음 시간을 계산하는 함수
 * - Reducer를 통해서 업데이트 로직을 할 수 있지만, action.type에 해당하는 로직이 이것밖에 없기 떄문에 너무 오버엔진니어링 같은 느낌이라 단순 함수로 분리
 * 
*/
export function timerNextTick(hours: number, minutes: number, seconds: number) {

  // Timer에 지정한 시간이 모두 지난 경우
  if(hours + minutes + seconds === 0) {
    return { hours, minutes, seconds };
  }

  // Timer에 지정한 시간이 만료되지 않고 남아있는 경우
  // 조건 1. 초가 남아있는 경우 1초씩 감소시킨다.
  // 조건 2. 초가 남아있지 않고, 분이 남아있는 경우 1분을 감소시키고 초를 59초로 초기화시킨다.
  // 조건 3. 분이 남아있지 않고, 시가 남아있는 경우 1시간을 감소시키고 분을 59분으로 초기화시킨다.
  if(seconds > 0) seconds -= 1;
  else {
    if(minutes > 0) {
      minutes -= 1;
      seconds = 59;
    } else if(hours > 0) {
      hours -= 1;
      minutes = 59;
    }
  }

  return { hours, minutes, seconds };
}