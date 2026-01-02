import { useRef, useState } from "react";
import { getNextTick, recordTime } from "../lib";

export interface StopwatchTimer {
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export type Lap = { id: number } & StopwatchTimer;

interface StopwatchState {
  mode: boolean;
  totalTime: StopwatchTimer;
  currentTime: StopwatchTimer;
}

export default function useStopwatch() {
  const stopwatchIntervalId = useRef<number>(0);
  const [stopwatch, setStopwatch] = useState<StopwatchState>({
    mode: false,
    totalTime: { minutes: 0, seconds: 0, milliseconds: 0 },
    currentTime: { minutes: 0, seconds: 0, milliseconds: 0 },
  });
  const [laps, setLaps] = useState<Lap[]>([]);

  // Stopwatch 시작 이벤트 리스너
  const handleStartStopwatch = () => {
    setStopwatch((prev) => ({ ...prev, mode: true })); // Stopwatch 모드를 활성화 시킨다.

    // 기록(Lap)이 없을 경우 Lap을 추가시켜준다. -> 중단 후 재시작을 할 때는 기록이 추가되지 않고, 재활성화된다.
    if(laps.length === 0) {
      setLaps((prev) => recordTime(prev, stopwatch.currentTime));
      setStopwatch((prev) => ({ ...prev, currentTime: { minutes: 0, seconds: 0, milliseconds: 0 } }));
    }

    // 0.001초 (10ms)마다 시간을 갱신시킨다.
    // 이때, totalTime 뿐만 아니라 currentTime도 같이 진행을 시켜준다.
    stopwatchIntervalId.current = setInterval(() => {
      setStopwatch((prev) => ({ ...prev, totalTime: getNextTick(prev.totalTime) }));
      setStopwatch((prev) => ({ ...prev, currentTime: getNextTick(prev.currentTime) }));
    }, 10);
  };

  // Stopwatch 중단 이벤트 리스너
  const handleStopStopwatch = () => {
    if(!stopwatchIntervalId.current) return;

    setStopwatch((prev) => ({ ...prev, mode: false })); // Stopwatch 모드를 비활성화 시킨다.
    clearInterval(stopwatchIntervalId.current);
  };

  // Stopwatch 초기화 이벤트 리스너
  const handleResetStopwatch = () => {
    setStopwatch({
      mode: false,
      totalTime: { minutes: 0, seconds: 0, milliseconds: 0 },
      currentTime: { minutes: 0, seconds: 0, milliseconds: 0 }
    });
    setLaps([]);
  };

  // Stopwatch 기록 추가 이벤트 리스너
  const handleRecordStopwatch = () => {
    setLaps((prev) => recordTime(prev, stopwatch.currentTime));
    setStopwatch((prev) => ({ ...prev, currentTime: { minutes: 0, seconds: 0, milliseconds: 0 } }));
  };

  return {
    stopwatch,
    laps,
    handleStartStopwatch,
    handleStopStopwatch,
    handleResetStopwatch,
    handleRecordStopwatch,
  }
}