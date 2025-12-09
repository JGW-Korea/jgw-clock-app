import type { TimePickerController, TimePickerState } from ".";

/**
 * createScrollWatcher 보조 함수에서 사용될 객체 구성
 * 
 * @property {HTMLUListElement} target - 실제 스크롤이 발생되는 Controller 요소
 * @property {frames} frames - 스크롤이 중단된 최대 시점
 * @property {Function} onStart - 스크롤 발생 시점에 수행될 로직
 * @property {Function} onStop - 스크롤 수행 도중에 수행될 로직
 * @property {Function} onFrame - 스크롤 중단 시점에 수행될 로직
 */
export interface ScrollWatcher {
  frames?: number,
  onStart: () => void;
  onStop: () => void;
  onFrame: () => void;
}

/**
 * createScrollWatcher 보조 함수에서 반환할 객체 구성
 * 
 * @property {Function} destroy - createScrollWatcher를 통해 등록된 이벤트, RHF 등의 참조를 제거하는 메서드
 */
export interface ScrollWatcherReturn {
  destroy: () => void;
}

/**
 * registerScrollWatcher 보조 함수에서 사용될 객체 구성
 * 
 * @property {TimePickerController} controller - 스크롤 수행 감지 대상이 될 실제 DOM 요소
 * @property {HTMLDivElement} proxy - Controller의 드래그 대상이 될 중간자(proxy) 요소
 * @property {HTMLUListElement} meridiem - Hours 스크롤 변화로 인해 AM <-> PM 자동 전환이 될 실제 Meridiem DOM 요소
 * @property {TimePickerState} state - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 */
export interface RegisterScrollWatcherParameter {
  controller: TimePickerController;
  proxy: HTMLDivElement;
  meridiem: HTMLUListElement;
  state: TimePickerState;
  updateTimePicker: (isPM: boolean, hours: number, minutes: number) => void;
}