import type { TimePickerState } from "../types";

/**
 * TimePicker 내부의 정오 이전 상태(isPMState)의 값을 변경하는 유틸 함수
 * 
 * @param {TimePickerState} state - 객체를 통해 전달받아 참조 주소 내부의 isPMState 값을 변경한다.
 * @param {boolean} updateIsPMState - 스크롤을 통해 변경된 시간을 기준의 AM / PM 상태
*/
export function setMeridiem(state: TimePickerState, updateIsPMState: boolean) {
  state["isPMState"] = !!updateIsPMState;
}