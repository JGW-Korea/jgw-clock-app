import type { ControlState } from "../types";

/**
 * Reducer 함수의 Action.type에 맞는 상태를 변경하기 위한 유틸 함수
 * 
 * @param {ControlState} state - Alarm Route 내부에서 현재 상태 값
 * @param {keyof ControlState} key - Control State 중 변경할 상태의 키 값
 * @param {boolean} value - 변경할 상태 값
*/
export function applyControlAction(state: ControlState, key: keyof ControlState, value: boolean): ControlState {
  return {
    ...state,
    [key]: value
  }
}