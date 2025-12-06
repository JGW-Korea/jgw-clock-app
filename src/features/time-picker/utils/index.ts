import { BUFFER } from "../consts";
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





/**
 * TimePicker Controller 요소에서 스크롤 된 높이를 가지고 오는 유틸 함수
 * 
 * @param {HTMLElement} target - 스크롤 수행을 감지 대상이 될 실제 DOM 요소
 * @returns {number} target.scrollTop - 요소의 스크롤 된 높이
*/
export const getScrollPosition = (target: HTMLElement) => target.scrollTop;





/**
 * TimePicker Controller 스크롤이 수행될 때 어떤 li 자식의 가까운지 계산해 index 위치를 계산하는 유틸 함수
 * 
 * @param {HTMLElement} element - 스크롤 도중 Index를 계산할 실제 DOM 요소
*/
export function getScrollIndex(element: HTMLElement, straight = false) {
  const itemHeight = element.offsetHeight;

  if(!itemHeight) {
    return 0;
  }

  const raw = element.scrollTop / itemHeight;
  let idx = Math.round(raw);

  if(Math.abs(raw - Math.round(raw)) < 1e-6) idx = Math.round(raw);

  if(straight) return idx;
  
  const count = Math.round(element.scrollHeight / itemHeight);

  if(idx < 0 || idx > count - 2) idx = 0;

  return idx;
}


/**
 * 
*/
export function maintainInfiniteLoop(element: HTMLElement) {
  if(element.offsetHeight + element.scrollTop > element.scrollHeight - BUFFER) element.scrollTop = BUFFER;
  else if(element.scrollTop < BUFFER) element.scrollTop = element.scrollHeight - BUFFER;
}