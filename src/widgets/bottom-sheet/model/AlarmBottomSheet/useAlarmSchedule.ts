import { useContext, useReducer } from "react";
import type { AlarmState } from "../../../../shared/context/types";
import { AlarmContext } from "@entities/alarm";

type AlarmStateUpdateAction = 
  | { type: "TIME_PICKER_CHANGED", payload: { hours: number; minutes: number } }
  | { type: "TOGGLE_WEEKDAY", payload: { id: number, weekday: string } }
  | { type: "ALRARM_STATE_INIT" };

function reducer(state: AlarmState, action: AlarmStateUpdateAction): AlarmState {
  switch(action.type) {
    // TimePicker의 선택된 시간이 변경되는 경우의 업데이트 로직
    case "TIME_PICKER_CHANGED": {
      const { hours, minutes } = action.payload;

      return {
        ...state,
        hours,
        minutes
      }
    }
    
    // 사용자가 알림을 활성화시킬 요일을 선택한 경우의 업데이트 로직
    case "TOGGLE_WEEKDAY": {
      const { id, weekday } = action.payload;

      // 선택한 요일을 다시 선택한 경우 -> 해당 요일 취소
      // 방법 1. 가독성은 좋지만 n^2 시간으로 인해 속도가 더 느린 로직
      for(const prev of state.weekdays) {
        if(prev.numberValue === id) {
          return {
            ...state,
            weekdays: state.weekdays.filter(weekday => weekday.numberValue !== id)
          }
        }
      }

      // 방법 2. 가독성은 떨어지지만, 선형 시간으로 인해 속도가 더 빠른 로직
      // let filterWeekdays = []; // 참조 자료형이지만, flag와 변수 선언 방식을 통일시키기 위해 let으로 설정
      // let flag = false;
      // for(const prevWeekdays of state.weekdays) {
      //   if(prevWeekdays.id !== id) filterWeekdays.push(prevWeekdays);
      //   else {
      //     flag = true;
      //   }
      // }

      // if(flag) {
      //   return {
      //     ...state,
      //     weekdays: filterWeekdays
      //   }
      // }
      
      // 선택하지 않은 요일을 선택한 경우 -> 해당 요일 선택
      return {
        ...state,
        weekdays: [
          ...state.weekdays,
          {
            numberValue: id,
            stringValue: weekday
          }
        ]
      }
    }

    case "ALRARM_STATE_INIT": {
      return {
        hours: 0,
        minutes: 0,
        weekdays: []
      }
    }
  }
}

export function useAlarmSchedule() {
  // hours, minutes, weekdays
  const [alarmState, dispatch] = useReducer(reducer, {
    hours: 0,
    minutes: 0,
    weekdays: []
  });

  const { handleAddAlarm } = useContext(AlarmContext)!;

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
  function handleToggleWeekday(id: number, weekday: string) {
    dispatch({
      type: "TOGGLE_WEEKDAY",
      payload: {
        id,
        weekday
      },
    });
  }

  // 최종적으로 알림을 추가한 경우 (관련 기능 미구현으로 인해 주석으로만 처리)
  // function handleConfirmAlarm() {
  //   // 현재 최종적으로 반영된 상태를 알림 리스트 상태에 추가한다.
  //   // - 별도의 알림 리스트 상태를 관리한다. -> 전역으로 관리해야 될 수 있음 -> 왜냐하면 각 리스트마다 시간을 정해서 알림이 울리도록 해야되기 때문에
  //   //    -> 근데 현재 라우트 컴포넌트 마운트 시에 리스트를 관리하면 해당 라우트 진입 시에만 알림이 울릴 수 있도록 설정됨
  //   //    -> and 다른 라우트에서는 사용자가 설정한 시간마다 알림이 울리지 않음
  //   // - 알림 리스트 상태를 관리하는 로직에서 localStroage에 반영한다.
  //   // - 출처가 동일한 경우 해당 알림을 울리기 위해 전역으로 관리해야 될 수도 있다.
  //   // - Bottom Sheet를 close 시킨다.
  // }

  return { alarmState, dispatch, handleTimeChange, handleToggleWeekday, handleAddAlarm };
}
