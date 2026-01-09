![Timer Refactoring](./images/timer-refactoring.png)

> ☝️ 이 문서는 기존 타이머 상태 관리 로직의 문제점을 분석하고, 이를 해결하기 위한 리팩토링 과정을 단계적으로 설명한 문서입니다.

## I. 기존 타이머 상태 관리 로직

기존 타이머 상태 관리 로직은 초기 구현 단계에서는 기능 개발을 빠르게 진행하는 데 집중하여 작성되었습니다. 이 과정에서 상태의 초기 값이 객체로 구성되어 있었기 때문에, 복잡한 상태 관리 로직은 `useReducer`로 관리하는 것이 더 낫다고 판단하여 다음과 같이 상태 관리 로직을 작성했습니다.

```tsx
// action.type에 따른 동작을 수행하는 redcuer 함수
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
```

```tsx
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
```

하지만 현재 작성된 로직은 리렌더링을 발생시키는 상태로 관리할 필요가 없는 값까지 상태로 분리되어 있거나, 하나의 상태로 관리할 수 있음에도 불구하고 여러 개의 상태로 나누어 관리하고 있습니다.

또한 `action.type`으로 동작을 구분한 뒤, `action.payload`로 전달된 추가 정보를 기준으로 다시 분기 처리를 하고 있기 때문에 불필요하게 코드의 복잡도가 증가하고 있다고 판단하여 리팩토링을 진행하기로 했습니다.