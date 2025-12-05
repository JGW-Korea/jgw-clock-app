import type { TimePickerState } from "../types";
import { setMeridiem } from "../utils";

/**
 * 각 Controller의 스크롤 위치를 현재 시간대를 기준으로 맞추는 보조 함수
 * 
 * @param {TimePickerState} state - TimePicker 내부에서 사용되는 상태
 * @param {HTMLUListElement[]} refs - 현재 시간
*/
export default function setScrollPositionByCurrentTime(state: TimePickerState, [meridiem, hours, minutes]: HTMLUListElement[]) {
  const now = new Date();
  const [
    currentHours,
    currentMinutes,
    currentMeridiem
  ] = [now.getHours(), now.getMinutes(), now.getHours() >= 12];

  // 각 Controller의 실제 DOM에 접근하여 scrollTo 메서드를 통해 스크롤 위치를 변경한다.
  meridiem.scrollTo(0, currentMeridiem ? meridiem.scrollHeight : 0);
  hours.scrollTo(0, (hours.scrollHeight / 61) * currentHours);
  minutes.scrollTo(0, (minutes.scrollHeight / 61) * Math.min(59, currentMinutes));

  setMeridiem(state, currentMeridiem); // 초기화 한 시간을 기준으로 AM / PM의 상태를 업데이트한다.
}