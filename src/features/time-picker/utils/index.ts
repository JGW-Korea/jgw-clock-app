import gsap from "gsap";
import { BUFFER, DEG_STEP, LINE_HEIGHT, TOTAL } from "../consts";
import type { TimePickerState } from "../types";

/**
 * TimePicker 내부의 정오 이전 상태(isPMState)의 값을 변경하는 유틸 함수
 * 
 * @param {TimePickerState} state - 객체를 통해 전달받아 참조 주소 내부의 isPMState 값을 변경한다.
 * @param {boolean} updateIsPMState - 스크롤을 통해 변경된 시간을 기준의 AM / PM 상태
*/
export const setMeridiem = (state: TimePickerState, updateIsPMState: boolean) => {
  state["isPMState"] = !!updateIsPMState;
}

/**
 * TimePicker Controller 스크롤이 수행될 때 어떤 li 자식의 가까운지 계산해 index 위치를 계산하는 유틸 함수
 * 
 * @param {HTMLElement} element - 스크롤 도중 Index를 계산할 실제 DOM 요소
 * @param {boolean} straight - 무한 스크롤 여부에 따라 인덱스를 어떻게 반환할지 정하는 값
*/
export const getScrollIndex = (element: HTMLElement, straight: boolean = false) => {
  // 실제 아이템 하나의 높이를 기준으로 인덱스를 계산한다.
  const itemHeight = (element.firstElementChild as HTMLElement | null)?.offsetHeight || LINE_HEIGHT;

  if(!itemHeight) {
    return 0;
  }

  const raw = element.scrollTop / itemHeight;
  let idx = Math.round(raw);

  if(straight) return idx;
  
  const count = Math.round(element.scrollHeight / itemHeight);

  if(idx < 0 || idx > count - 2) idx = 0;

  return idx % TOTAL;
}

/**
 * TimePicker의 스크롤 위치가 끝단에 도달했는지 추적하여 반대편으로 이동시키는 유틸 함수
 * 
 * @param {HTMLElement} controller - 실제 스크롤이 되는 Contrller 요소
*/
export const maintainInfiniteLoop = (controller: HTMLElement) => {
  if(controller.offsetHeight + controller.scrollTop > controller.scrollHeight - BUFFER) controller.scrollTop = BUFFER;
  else if(controller.scrollTop < BUFFER) controller.scrollTop = controller.scrollHeight - BUFFER;
}

/**
 * Controller의 위치를 음수･양수 상관없이 0~59 범위의 인덱스로 변환하는 유틸 함수
 * 
 * @param {number} index - 현재 Controller의 위치
*/
export const mod60 = (index: number) => ((index % 60) + 60) % 60;

/**
 * TimePicker의 드래그를 위한 중간자(proxy)의 위치를 현재 스크롤 된 높이와 동일하게 설정하기 위한 유틸 함수
 * 
 * @param {HTMLDivElement} proxy - 중간자 요소
 * @param {number} index - 실제 TimePicker Controller 현재 위치
*/
export const setProxyRotationFromIndex = (proxy: HTMLDivElement, index: number) => {
  // gsap을 통해 Proxy 요소의 회전 값을 계산하여 Controller와 동일한 회전을 가지게 설정한다.
  gsap.set(proxy, {
    rotation: -index * DEG_STEP,
  });
}

/**
 * 드래그를 통해 변경된 Controller의 각도를 현재 위치를 계산하는 유틸 함수
 * 
 * @param {number} deg - 현재 회전 각도
*/
export const indexFromRotation = (deg: number) => {
  return Math.round(deg < 0 ? Math.abs((deg % 360) / DEG_STEP) : TOTAL - (deg % 360) / DEG_STEP) % TOTAL;
}

/**
 * GSAP Draggable을 통해 수정된 인라인 스타일(Inline-Style) 속성 값을 초기화하는 유틸 함수
 * 
 * @param {HTMLElement[]} elements - Controller의 형제 요소인 Wheel과 Track
*/
export const clearScrollPropsIfCSS = (elements: HTMLElement[]) => {
  if(!CSS.supports("animation-timeline: scroll()")) return;

  // 요소에 적용된 CSS 애니메이션 전체를 제거한다. 
  for(const element of elements) {
    gsap.set(element, { 
      clearProps: "all" 
    });
  }
}