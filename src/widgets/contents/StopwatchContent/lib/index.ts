import type { Lap, StopwatchTimer } from "../model";

/**
 * Stopwatch의 Timer 시간을 10ms 간격으로 시간을 갱신하는 로직
*/
export function getNextTick(current: StopwatchTimer): StopwatchTimer {
  let { minutes, seconds, milliseconds } = current;

  // 밀리초를 갱신하고, 밀리초가 0.1초랑 같은지 판별 후 동일할 경우 second를 갱신한다.
  milliseconds += 1;
  if(milliseconds > 99) {
    seconds += 1;
    milliseconds = 0;
  }

  // 위 조건식에서 0.1초씩 갱신 된 경우, 초가 1분 단위로 갱신될 수 있는지 판별하여 minutes를 갱신한다.
  if(seconds > 59) {
    minutes += 1;
    seconds = 0;
  }

  return { minutes, seconds, milliseconds };
}

export function recordTime(laps: Lap[], current: StopwatchTimer): Lap[] {
  if(laps.length === 0) return [{ id: 1, ...current }];

  laps[0].minutes = current.minutes;
  laps[0].seconds = current.seconds;
  laps[0].milliseconds = current.milliseconds;

  return [
    {
      id: laps.length + 1,
      ...{ minutes: 0, seconds: 0, milliseconds: 0 }
    },
    ...laps
  ];
}