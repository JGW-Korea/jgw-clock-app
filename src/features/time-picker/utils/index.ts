import { gsap } from "gsap/gsap-core";
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
  // HTML 속성의 변수 dataset의 isLooping이 "true" 설정되어 있다면 현재 프레임에서는 아래 로직을 무시하고 함수를 종료한다.
  if(controller.dataset.isLooping === "true") {
    controller.dataset.isLooping = "false";
    return;
  }
  const { scrollTop, scrollHeight, offsetHeight } = controller;
  const maxScroll = scrollHeight - offsetHeight; // 스크롤 전체 높이 - 요소의 높이(padding, border 포함)

  // 현재 스크롤 된 높이가 최대 스크롤 높이보다 큰 경우 -> 스크롤 높이가 바닥에 닿은 경우 마지막 위치를 첫번째 위치로 옮긴다.
  if(scrollTop > maxScroll - BUFFER) {
    controller.dataset.isLooping = "true";
    
    // controller 스타일의 scroll-snap-type을 none으로 설정하여 스냅을 무시시킨다.
    // 이는 기존 y 축의 가장 가까운 스냅 포인트로 강제 이동하여 BUFFER를 이용하지 못하고 무한 루프가 되는 것을 방지하기 위함이다.
    controller.style.scrollSnapType = "none";

    controller.scrollTop = BUFFER; // 스크롤의 위치를 무한 루프가 되지 않도록 시각적인 눈속임으로 정말 낮은 간격에 위치시킨다.
    // console.log("Down -> Up:", { from: scrollTop, to: controller.scrollTop });
  }

  // 현재 스크롤 된 높이가 BUFFER보다 작은 경우 -> 스크롤 높이가 천장에 닿아 첫 번째 위치를 마지막 위치를 옮긴다.
  if(scrollTop < BUFFER) {
    controller.dataset.isLooping = "true";
    controller.style.scrollSnapType = "none"; // 위와 동일한 이유
    controller.scrollTop = maxScroll - BUFFER; // 스크롤 할 수 있는 가장 하단에 BUFFER를 뺀 만큼의 위치에 스크롤을 놓이게 한다.
    // console.log("Up -> Down:", { from: scrollTop, to: controller.scrollTop });
  }

  // 위 조건으로 인해 HTML 요소 자체에 붙은 style 속성을 제거한다.
  controller.style.removeProperty("scroll-snap-type");
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