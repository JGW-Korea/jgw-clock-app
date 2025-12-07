/** TimePicker Controller 종류 */
type TimePickerType = "meridiem" | "hours" | "minutes"; 

/**
 * 참조를 통해 유지하는 TimePicker Controller의 내부 구성
 * 
 * @property {TimePickerType} type - Controller의 종류
 * @property {HTMLUListElement} element - 실제 스크롤을 수행하는 Controller
 * @property {HTMLDivElement} wheel - 화면에 표시되는 Wheel 요소
 * @property {HTMLDivElement} track - 선택 바에 표시된 강조 영역 Track 요소
*/
interface TimePickerController {
  type: TimePickerType;
  element: HTMLUListElement;
  wheel: HTMLDivElement;
  track: HTMLDivElement;
}

// TimePicker 컴포넌트 내부에서 관리될 상태 타입 (리렌더링에 영향을 주는 State가 아님!!)
interface TimePickerState {
  isPMState: boolean;
  currentHours: number;
  currentMinutes: number;
  prevWrapped: number | null;     //
  prevUnwrapped: number | null;   //
  meridiemOverride: boolean;      //
  lastOverride: boolean;          // 
  passiveTrigger: boolean;        // 
  meridiemStart: number | null;   //
  meridiemGuard: boolean;         // 
}

interface TimePickerMeridiemState {
  prevWrapped: number | null;        // Hours index를 0~59 범위로 보정한 값을 저장하는 속성
  prevUnwrapped: number | null;      // Hours index의 변화량 그대로 기록한 값을 저장하는 속성
  meridiemOverride: boolean;         // Meridiem의 현재 상태가 오전(AM), 오후(PM)에 따라 Hours의 스크롤 높이를 보정(-12, +12)해야 하는지를 결정하는 속성
  lastOverride: boolean;             // meridiemOverride의 상태가 변경되기 직전의 값을 저장해 두는 속성
  passiveTrigger: boolean;           // Hours를 통해 AM <-> PM이 자동으로 전환된 직후 Meridiem Controller에 등록된 스크롤 애니메이션이 추가 발생하는걸 막는 속성
  meridiemStart: number | null;      // Meridiem Controller 스크롤 시작 시점의 index 값
  meridiemGuard: boolean;            // Hours Controller를 스크롤 하는 중에 Meridiem이 조기 전환되는걸 막는 속성
}

export type { TimePickerType, TimePickerController, TimePickerState, TimePickerMeridiemState };
export type * from "./scrollWatcher";
export type * from "./draggable";