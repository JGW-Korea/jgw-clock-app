import { useEffect, useRef, useState } from "react";
import { timerNextTick } from "../lib";

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  hours: number;
  minutes: number;
  seconds: number;
}

export type TimeUnit = keyof Omit<TimerState, "isActive" | "isPaused">; // TimerState의 isActive | isPaused를 제외한 객체의 키를 타입으로 가지는 타입

const timerInitalState: TimerState = {
  isActive: false,
  isPaused: false,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export default function useTimer() {
  const totalSeconds = useRef<number>(0); // 전체 진행률을 계산하기 위한 참조 객체
  const [timerState, setTimerState] = useState<TimerState>(timerInitalState);

  const currentTotal = (timerState.hours * 3600) + (timerState.minutes * 60) + timerState.seconds;
  const progress = totalSeconds.current > 0 ? currentTotal / totalSeconds.current : 0;

  /**
   * Timer가 활성화 되지 않은 상태에서 시간을 증가시키는 로직
   * @param {TimeUnit} type - 상태의 값을 증가시킬 시간
  */
  const handleTimerIncrement = (type: TimeUnit) => {
    if(!timerState.isActive) {
      setTimerState((prev) => ({
        ...prev,
        [type]: prev[type] + 1
      }));
    }
  }

  /**
   * Timer가 활성화 되지 않은 상태에서 시간을 감소시키는 로직
   * @param {TimeUnit} type - 상태의 값을 증가시킬 시간
  */
  const handleTimerDecrement = (type: TimeUnit) => {
    if(!timerState.isActive) {
      setTimerState((prev) => ({
        ...prev,
        [type]: prev[type] - 1
      }));
    }
  }

  /** Timer를 실행시키는 이벤트 핸들러 */
  const handleStartTimer = () => {
    if(currentTotal > 0) {
      if(totalSeconds.current === 0) {
        totalSeconds.current = currentTotal;
      }

      setTimerState((prev) => ({
        ...prev,
        isActive: true,
        isPaused: false,
      }));
    }
  }

  /** Timer를 중지시키는 이벤트 핸들러 */
  const handleStopTimer = () => {
    setTimerState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: true
    }));
  }

  /** Timer를 초기화시키는 이벤트 핸들러 */
  const handleResetTimer = () => {
    setTimerState(timerInitalState);
    totalSeconds.current = 0;
  }

  // 컴포넌트 마운트 + 의존성 배열 내용 변경 시 발생할 사이드 이펙트(side-effect)
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    // Timer를 실행시킨 이후에만 동작
    if(timerState.isActive) {
      let { hours, minutes, seconds } = timerState;
      
      intervalId = setInterval(() => {
        if(hours === 0 && minutes === 0 && seconds === 0) {
          setTimerState(timerInitalState);
          totalSeconds.current = 0;
          return;
        }

        const nextTick = timerNextTick(hours, minutes, seconds);
        hours = nextTick.hours;
        minutes = nextTick.minutes;
        seconds = nextTick.seconds;

        setTimerState((prev) => ({
          ...prev,
          hours,
          minutes,
          seconds
        }));
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    }
  }, [timerState.isActive]);

  return {
    timerState,
    progress,
    handleTimerIncrement,
    handleTimerDecrement,
    handleStartTimer,
    handleStopTimer,
    handleResetTimer
  };
}