import type { TimePickerController, TimePickerState } from "../types";
import { setMeridiem } from "../utils";

/**
 * 각 Controller의 스크롤 위치를 현재 시간대를 기준으로 맞추는 보조 함수
 * 
 * @param {TimePickerState} state - TimePicker 내부에서 사용되는 상태
 * @param {HTMLUListElement[]} refs - 현재 시간
*/
export function setScrollPositionByCurrentTime(state: TimePickerState, [meridiem, hours, minutes]: TimePickerController[], updateTimePicker: (isPM: boolean, hours: number, minutes: number) => void) {
  const now = new Date();
  const [
    currentHours,
    currentMinutes,
    currentMeridiem
  ] = [now.getHours(), now.getMinutes(), now.getHours() >= 12];

  // 각 Controller의 실제 DOM에 접근하여 scrollTo 메서드를 통해 스크롤 위치를 변경한다.
  meridiem.element.scrollTo(0, currentMeridiem ? meridiem.element.scrollHeight : 0);
  hours.element.scrollTo(0, (hours.element.scrollHeight / 61) * currentHours);
  minutes.element.scrollTo(0, (minutes.element.scrollHeight / 61) * Math.min(59, currentMinutes));

  // 현재 시간에 맞춰서 상태를 업데이트 해준다.
  state.currentHours = currentHours;
  state.currentMinutes = Math.min(59, currentMinutes);
  setMeridiem(state, currentMeridiem); // 초기화 한 시간을 기준으로 AM / PM의 상태를 업데이트한다.

  // 변경된 시간을 알림 시간에 반영해준다.
  updateTimePicker(state.isPMState, state.currentHours, state.currentMinutes);
}