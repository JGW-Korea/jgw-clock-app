import type { TimePickerState } from "../types";
import { mod60 } from "../utils";

/**
 * Meridiem Controller의 AM <-> PM을 자동으로 전환 시키는 보조 함수
 * 
 * @param {TimePickerState} state - 현재 TimePicker 내부에서 관리되는 상태
 * @param {HTMLUListElement} meridiem - 실제 AM <-> PM 자동 전환 시킬 Meridiem Controller
*/
function toggleMeridiem(state: TimePickerState, meridiem: HTMLUListElement) {
  // TimePicker 내부 상태를 변경해준다.
  state.isPMState = !state.isPMState;
  state.passiveTrigger = true;

  // Meridiem Controller의 스크롤 위치를 변경시킨다.
  meridiem.scrollTo({
    top: state.isPMState ? meridiem.scrollHeight : 0,
    behavior: "smooth"
  });
}

/**
 * Hours Controller의 스크롤 높낮이에 따라 Meridiem Controller의 변경을 수행해야 될지를 판단하는 보조 함수
 * 
 * @param {number} currentIndex - Hours Controller가 스크롤 된 현재 높이
 * @param {TimePickerState} state - 현재 TimePicker 내부에서 관리되는 상태
 * @param {HTMLUListElement} meridiem - 실제 AM <-> PM 자동 전환 시킬 Meridiem Controller
*/
export function syncMeridiem(currentIndex: number, state: TimePickerState, meridiem: HTMLUListElement) {
  const index = mod60(currentIndex + (state.meridiemOverride ? 12 : 0));

  if(state.prevWrapped === null || state.prevUnwrapped === null) {
    state.prevWrapped = index;
    state.prevUnwrapped = index;
    state.lastOverride = state.meridiemOverride;
    return;
  }

  if(state.lastOverride !== state.meridiemOverride) {
    const shift = state.meridiemOverride ? +12 : -12;
    state.prevWrapped = mod60(state.prevWrapped + shift);
    state.prevUnwrapped += shift;
    state.lastOverride = state.meridiemOverride;
  }

  let delta = index - state.prevWrapped;

  if(delta > 30) delta -= 60;
  else if(delta < -30) delta += 60;
  if(delta === 0) return;

  const before = Math.floor(state.prevUnwrapped / 12);
  const after = Math.floor((state.prevUnwrapped + delta) / 12);

  if((after - before) & 1) {
    toggleMeridiem(state, meridiem);
  }

  state.prevWrapped = index;
  state.prevUnwrapped += delta;
}