import { useReducer } from "react";

interface State {
  hours: number;
  minutes: number;
  weekdays: number[];
}

type Action = 
  | { type: "TIME_PICKER_CHANGED", payload: { hours: number; minutes: number } }
  | { type: "TOGGLE_WEEKDAY", payload: { weekdayId: number } };

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case "TIME_PICKER_CHANGED": {
      const { hours, minutes } = action.payload;

      return {
        ...state,
        hours,
        minutes
      }
    }
    case "TOGGLE_WEEKDAY": {
      const { weekdayId } = action.payload;

      // 선택한 요일을 다시 선택한 경우 -> 해당 요일 취소
      if(state.weekdays.includes(weekdayId)) {
        return {
          ...state,
          weekdays: state.weekdays.filter((prev) => prev !== weekdayId)
        }
      }

      // 선택하지 않은 요일을 선택한 경우 -> 해당 요일 선택
      return {
        ...state,
        weekdays: [...state.weekdays, weekdayId]
      };
    }
  }
}

export default function useAlarmConfiguration() {
  // hours, minutes, weekdays
  const [state, dispatch] = useReducer(reducer, {
    hours: 0,
    minutes: 0,
    weekdays: []
  });

  // TimePicker의 선택된 시간이 변경되는 경우
  function handleTimeChange(isPM: boolean, hours: number, minutes: number) {
    // hours의 index는 0~59이기 때문에 12시간제로 변경 후, Date() 객체에 사용할 수 있는 24시간제로 변경한다.
    // 단, Date() 객체의 hours는 0 부터 시작하기 때문에 24시간제는 0~23 범위를 가진다.
    const hour12 = hours % 12 || 12;
    hours = isPM ? (hour12 % 12) + 12 : (hour12 % 12);

    // dispatch를 통해 수행시킬 액션을 리듀서에 전달하여 상태를 갱신한다.
    dispatch({
      type: "TIME_PICKER_CHANGED",
      payload: {
        hours,
        minutes
      }
    });
  }

  // 사용자가 알림을 활성화시킬 요일을 선택한 경우
  function handleToggleWeekday(weekdayId: number) {
    dispatch({
      type: "TOGGLE_WEEKDAY",
      payload: {
        weekdayId
      },
    });
  }

  // 최종적으로 알림을 추가한 경우 (관련 기능 미구현으로 인해 주석으로만 처리)
  function handleConfirmAlarm() {
    // 현재 최종적으로 반영된 상태를 알림 리스트 상태에 추가한다.
    // - 별도의 알림 리스트 상태를 관리한다.
    // - 알림 리스트 상태를 관리하는 로직에서 localStroage에 반영한다.
    // - 출처가 동일한 경우 해당 알림을 울리기 위해 전역으로 관리해야 될 수도 있다.
    // - Bottom Sheet를 close 시킨다.
  }

  return { state, handleTimeChange, handleToggleWeekday, handleConfirmAlarm };
}
