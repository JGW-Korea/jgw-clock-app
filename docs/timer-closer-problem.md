![Timer Refactoring](./images/timer-refactoring.png)

> ☝️ 이 문서는 기존 타이머 상태 관리 로직의 문제점을 분석하고, 이를 해결하기 위한 리팩토링 과정을 단계적으로 설명한 문서입니다.

<br />

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

<br />

## II. 상태 관리 로직을 useState 기반으로 리팩토링

기존 타이머 상태 관리 로직은 다음 코드에서 볼 수 있듯이, 상태로 관리할 필요가 없는 값이 포함되어 있거나 하나의 상태로 관리할 수 있음에도 불구하고 여러 개의 상태로 분리되어 있었습니다.

```tsx
// 기존 타이머의 상태를 관리하는 값
// -> hours, minutes, seconds의 증감 여부는 조건부 처리나 파생 상태로 관리할 수 있음에도 불구하고, 하나의 객체 상태로 함께 관리하고 있음
const [timerState, dispatch] = useReducer(reducer, {
  hours: { value: 0, increment: true, decrement: false },
  minutes: { value: 0, increment: true, decrement: false },
  seconds: { value: 0, increment: true, decrement: false }
});

const [totalSeconds, setTotalSeconds] = useState<number>(0);    // 전체 진행률 계산을 위해 사용되는 계산값임에도 불구하고 상태로 관리하고 있음

// 타이머의 시작 및 일시 정지 여부를 각각 독립된 상태로 관리하고 있음
const [timerStart, setTimerStart] = useState<boolean>(false);
const [isPaused, setIsPaused] = useState<boolean>(false);
```

또한 화면에 반영할 타이머 상태를 객체 구조로 관리하고 있었기 때문에, 초기 구현 단계에서는 복잡한 상태 구조를 다루기에 `useReducer`가 적절하다고 판단하여 해당 방식으로 상태를 관리했습니다.

다만, 상태가 여러 개로 분리되어 있는 구조에서 일부 상태는 `setState`로, 다른 상태는 `dispatch`를 통해 갱신하는 방식으로 관리되면서, 상태를 갱신하는 과정에서 불필요한 리렌더링이 발생할 수 있었고, 동시에 상태 갱신 로직의 복잡도를 높이고 있다고 판단했습니다.

```tsx
// 기존 dispatch를 통해 Action을 전달할 Reducer 함수
function reducer(state: TimerState, action: ActionType): TimerState {
  switch(action.type) {
    // 상태 초기화
    case "RESET": {
      return initalState;
    }

    // hours, minutes, seconds 값 증가 action
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

    // hours, minutes, seconds 값 감소 action
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

    // 타이머 시작 후 화면에 반영된 각 값을 1초 간격마다 값을 감소하기 위한 action
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
// 상태가 useState, useReducer 방식으로 분리되어 있는 구조의 상태 갱신 로직
useEffect(() => {
  let intervalId: ReturnType<typeof setInterval>;

  if(timerStart) {
    intervalId = setInterval(() => {
      // 지정한 시간이 모두 지난 경우 -> 기존 상태 초기화
      if(timerState.hours.value === 0 && timerState.minutes.value === 0 && timerState.seconds.value === 0) {
        // 독립적으로 관리되고 있는 상태를 갱신
        setTimerStart(false);
        setTotalSeconds(0);
        
        // dispatch 함수를 통해 useReducer로 관리되고 있는 상태 갱신
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
```

이로 인해 상태로 관리할 필요가 없는 값은 무엇인지, 서로 밀접하게 관련된 상태는 어떻게 하나로 묶을 수 있는지, 그리고 상태 갱신 로직의 복잡도를 어떻게 낮출 수 있는지를 고민하며 리팩토링을 진행하게 되었습니다.

<br />

**① 상태로 관리할 필요가 없는 값 구분**

리팩토링을 진행하기에 앞서, 먼저 현재 코드에서 굳이 상태로 관리할 필요가 없는 값을 구분하기 위해 코드를 분석했습니다.

```tsx
// hours, minutes, seconds 값에 따라 증감 가능 여부를 제어하기 위한 상태
useReducer(reducer, {
  hours: { value: 0, increment: true, decrement: false },
  minutes: { value: 0, increment: true, decrement: false },
  seconds: { value: 0, increment: true, decrement: false }
});

// 상태 변화에 따른 화면 갱신이 아닌, 진행률 계산에만 사용되는 단순 계산 값임에도 불구하고 상태로 관리되고 있음
const [totalSeconds, setTotalSeconds] = useState<number>(0);
```

코드를 분석한 결과, `hours`, `minutes`, `seconds` 값에 따라 증감 여부를 제어할 수 있음에도 불구하고 상태로 관리되고 있던 `increment`와 `decrement`, 그리고 진행률 계산에만 사용되는 단순 계산 값임에도 상태로 관리되고 있던 `totalSeconds`를 살태로 관리할 필요가 없는 값으로 구분하고, 이를 다음 코드와 같이 리팩토링을 진행했습니다.

```tsx
// increment, decrement 상태 제거
useRedcuer(reducer, {
  hours: 0,
  minutes: 0,
  seconds: 0,
});
```

```tsx
// 계산 값으로 사용되던 totalSeconds 값은 리렌더링이 발생해도 변경이 되지 않아야 하기 때문에,
// 일반 변수로 선언하지 않고, useRef() 훅을 통해 동일한 참조를 유지할 수 있는 값으로 선언
const totalSeconds = useRef<number>(0);
```

<br />

**② 서로 밀접하게 관련된 상태의 통합**

상태로 관리할 필요가 없는 값을 구분한 이후, 서로 밀접하게 연관된 상태를 하나로 통합하기 위해 코드를 분석했습니다.

```tsx
// 화면에 반영되는 시간 값을 관리하는 상태
useRedcuer(reducer, {
  hours: 0,
  minutes: 0,
  seconds: 0,
});

// 타이머의 시작 여부와 일시 정지 상태를 독립적으로 관리하고 있는 상태
const [timerStart, setTimerStart] = useState<boolean>(false);
const [isPaused, setIsPaused] = useState<boolean>(false);
```

코드를 분석한 결과, 화면에 반영되는 타이머 시간과 타이머 제어 상태는 엄밀히 따지면 서로 별개의 집합이지만, 타이머가 일시 정지되면 시간이 감소하지 않고, 타이머가 시작되면 시간이 감소하는 등 하나의 **"타이머"** 라는 교집합을 이루는 동작 구조를 가지고 있습니다. 이로 인해, 두 상태를 동일한 상태로 관리하는 것이 적절하다고 판단하여 다음 코드와 같이 리팩토링을 진행했습니다.

```tsx
// 기존 분리된 상태 구조를 하나의 상태로 통합
useRedcuer(reducer, {
  isActive: false,   // 타이머 시작 여부
  isPaused: false,   // 타이머 일시 정지 여부
  hours: 0,
  minutes: 0,
  seconds: 0
});
```

<br />

**③ 상태 갱신 로직의 복잡도 재설계**

상태 관리 방식을 변경에 따라 상태 갱신 로직 역시 수정이 필요했기 때문에, 변경된 구조에 맞게 reducer 함수를 재구성하기 위해 기존 코드를 분석했습니다.

```tsx
function reducer(state: TimerState, action: ActionType): TimerState {
  switch(action.type) {
    // 상태 초기화
    case "RESET": {
      return initalState;
    }

    // hours, minutes, seconds 값 증가 action
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

    // hours, minutes, seconds 값 감소 action
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

    // 타이머 시작 후 화면에 반영된 각 값을 1초 간격마다 값을 감소하기 위한 action
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

하지만 변경된 상태는 객체 구조를 유지하고 있기는 했지만, 각 프로퍼티가 number, boolean과 같은 단순한 원시 값으로만 구성되어 있습니다. 이로 인해 useReducer를 통해 상태를 관리하더라도, 기존 코드 대비 상태 갱신 로직의 복잡도를 다음과 같은 이유로 실질적으로 낮추기는 어렵다고 판단했습니다.

- 현재 상태 관리 구조에서는 타이머 시간의 증감 여부를 제어하던 increment, decrement 상태가 제거되었기 때문에, hours, minutes, seconds 값을 기준으로 조건을 Props로 전달하여 제어할 수 있는 구조가 되었습니다. 이로 인해 값을 증가하거나 감소시키는 로직을 action 단위로 분기하여 관리할 필요가 없어졌습니다.
- 또한, setInterval을 통해 1초 간격으로 시간이 감소하는 로직은 타이머 시간 증감 로직에 비해 상대적으로 복잡하지만, 해당 로직은 별도의 함수로 분리하여 관리함으로써 충분히 복잡도를 제어할 수 있다고 판단했습니다.
- 상태 초기화 역시 action 분기를 통해 처리하기보다는, 미리 정의된 초기 상태 값으로 대체하는 방식이 더 단순하고 직관적이었기 때문에, reducer 함수를 유지하는 것은 코드의 길이만 증가시키는 결과를 초래한다고 보았습니다.

이러한 이유로 useReducer를 통해 상태를 관리하는 방식보다는, useState에서 반환되는 상태 업데이트 함수(setState)를 사용하는 방식이 현재 상태 구조에 더 적합하며 코드의 흐름을 직관적으로 만들 수 있다고 판단하여, 이에 맞게 상태 갱신 로직을 리팩토링했습니다.

```tsx
// increment, decrement 상태 제거 후 hours, minutes, seconds 값을 통해 타이머 증감 여부 제어
<TimeSelector decrementDisabled={hours - 1 === -1} incrementDisabled={hours + 1 === 24} ... />
<TimeSelector decrementDisabled={minutes - 1 === -1} incrementDisabled={minutes + 1 === 60} ... />
<TimeSelector decrementDisabled={seconds - 1 === -1} incrementDisabled={seconds + 1 === 60} ... />
```

```tsx
// setInterval을 통해 1초 간격으로 시간이 감소하는 로직 별도 함수로 분리
export function timerNextTick(hours: number, minutes: number, seconds: number) {
  if(hours + minutes + seconds === 0) {
    return { hours, minutes, seconds };
  }

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
```

```tsx
// 미리 초기 상태를 정의한 후, 초기화가 필요한 경우 현재 상태를 초기 상태 값으로 대체
const timerInitalState: TimerState = {
  isActive: false,
  isPaused: false,
  hours: 0,
  minutes: 0,
  seconds: 0,
};
```

상태 갱신 로직의 복잡도를 분석 후, 리팩토링한 코드는 다음과 같습니다.

```tsx
// 리팩토링 이후 상태 갱신 로직
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
```

<br />