import type { TimePickerController, TimePickerState } from ".";

/**
 * registerDraggable 보조 함수에서 사용될 객체 구성
 * 
 * @property {TimePickerState} state - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 * @property {HTMLDivElement} proxy - 드래그 위치가 변경될 드래그 대상 요소
 * @property {TimePickerController} controller - 드래그 발생으로 인해 추적이 될 Controller 객체
 * @property {TimePickerController[]} controllers - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 */
export interface RegisterDraggableParameter {
  state: TimePickerState;
  proxy: HTMLDivElement;
  controller: TimePickerController;
  controllers: TimePickerController[];
  updateTimePicker: (isPM: boolean, hours: number, minutes: number) => void;
}

/**
 * GSAP Draggable.create 보조 함수에서 사용될 속성 구성
 * 
 * @property {HTMLDivElement} proxy - 드래그 위치가 변경될 드래그 대상 요소
 * @property {TimePickerController} controller - 드래그 발생으로 인해 추적이 될 Controller 객체
 * @property {TimePickerController[]} controllers - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 * @property {TimePickerState} state - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 * @property {Function} onStart - 드래그 발동 시 수행할 로직
 * @property {Function} onComplete - 드래그가 모두 종료된 이후 수행할 로직
 */
export interface CreateDraggableParameter {
  proxy: HTMLDivElement;
  controller: TimePickerController;
  controllers: TimePickerController[];
  state: TimePickerState;
  onStart: () => void;
  onComplete: (index: number) => void;
}

/**
 * 실제 드래그 도중에 수행할 함수에서 사용될 속성 구성
 * 
 * @property {TimePickerController} controller - 드래그 발생으로 인해 추적이 될 Controller 객체
 * @property {TimePickerController[]} controllers - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 * @property {TimePickerState} state - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 * @property {HTMLDivElement} currentRotation - 현재 드래그가 변경된 요소의 Rotation 값
 */
export interface DraggableParameter {
  controller: TimePickerController;
  controllers: TimePickerController[];
  state: TimePickerState;
  currentRotation: number;
}