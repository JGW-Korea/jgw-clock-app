import { useEffect, useReducer, useState } from "react";

type DummyType = { value: number, increment: boolean, decrement: boolean };

export interface TimerState {
  hours: DummyType;
  minutes: DummyType;
  seconds: DummyType;
}

type ActionType =
  | { type: "RESET" }
  | { type: "INCREMENT", payload: { type: keyof TimerState, value: number } }
  | { type: "DECREMENT", payload: { type: keyof TimerState, value: number } }
  | { type: "TICK" };

const initalState = { 
  hours: { value: 0, increment: true, decrement: false },
  minutes: { value: 0, increment: true, decrement: false },
  seconds: { value: 0, increment: true, decrement: false },
};

function reducer(state: TimerState, action: ActionType): TimerState {
  switch(action.type) {
    case "RESET": {
      return initalState;
    }

    case "INCREMENT": {
      if(action.payload.type === "hours" && (action.payload.value >= 0 && action.payload.value < 23)) {
        return {
          ...state,
          hours: { value: state.hours.value + 1, decrement: true, increment: !(state.hours.value + 1 === 23) }
        }
      } else if(action.payload.type === "minutes" && (action.payload.value >= 0 && action.payload.value < 59)) {
        return {
          ...state,
          minutes: { value: state.minutes.value + 1, decrement: true, increment: !(state.minutes.value + 1 === 59) }
        }
      } else if(action.payload.type === "seconds" && (action.payload.value >= 0 && action.payload.value < 59)) {
        return {
          ...state,
          seconds: { value: state.seconds.value + 1, decrement: true, increment: !(state.seconds.value + 1 === 59) }
        }
      }
      
      return state;
    }
    case "DECREMENT": {
      if(action.payload.type === "hours" && (action.payload.value > 0 && action.payload.value <= 24)) {
        return {
          ...state,
          hours: { value: state.hours.value - 1, decrement: !(state.hours.value - 1 === 0), increment: true }
        }
      } else if(action.payload.type === "minutes" && (action.payload.value > 0 && action.payload.value <= 60)) {
        return {
          ...state,
          minutes: { value: state.minutes.value - 1, decrement: !(state.minutes.value - 1 === 0), increment: true }
        }
      } else if(action.payload.type === "seconds" && (action.payload.value > 0 && action.payload.value <= 60)) {
        return {
          ...state,
          seconds: { value: state.seconds.value - 1, decrement: !(state.seconds.value - 1 === 0), increment: true }
        }
      }
      
      return state;
    }

    case "TICK": {
      let [hours, minutes, seconds] = [state.hours.value, state.minutes.value, state.seconds.value];

      if(hours === 0 && minutes === 0 && seconds === 0) return state; // 시간을 설정하지 않은 경우 종료

      if(seconds > 0) seconds -= 1;
      else {
        if(minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if(hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }
      }

      return {
        hours: { ...state.hours, value: hours },
        minutes: { ...state.minutes, value: minutes },
        seconds: { ...state.seconds, value: seconds },
      }
    }
  }
}

export default function useTimer() {
  const [timerState, dispatch] = useReducer(reducer, initalState);
  
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [timerStart, setTimerStart] = useState<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  const currentTotal = (timerState.hours.value * 3600) + (timerState.minutes.value * 60) + timerState.seconds.value;
  const progress = totalSeconds > 0 ? currentTotal / totalSeconds : 0;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if(timerStart) {
      intervalId = setInterval(() => {
        if(timerState.hours.value === 0 && timerState.minutes.value === 0 && timerState.seconds.value === 0) {
          setTimerStart(false);
          setTotalSeconds(0);
          dispatch({ type: "RESET" });
          return;
        }

        dispatch({ type: "TICK" });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    }
  }, [timerStart, timerState]);

  return {
    timerState,
    timerStart,
    isPaused,
    progress,
    increment(type: keyof TimerState) {
      if(!timerStart) {
        dispatch({ type: "INCREMENT", payload: { type, value: timerState[type].value } })
      }
    },
    decrement(type: keyof TimerState) {
      if(!timerStart) {
        dispatch({ type: "DECREMENT", payload: { type, value: timerState[type].value } });
      }
    },
    handleStart() {
      if(currentTotal > 0) {
        if(totalSeconds === 0) {
          setTotalSeconds(currentTotal);
        }

        setTimerStart(true);
        setIsPaused(false);
      }
    },
    handleStop() {
      setTimerStart(false);
      setIsPaused(true);
    },
    handleReset() {
      setTimerStart(false);
      setIsPaused(false);
      setTotalSeconds(0);
      dispatch({ type: "RESET" });
    }
  }
}