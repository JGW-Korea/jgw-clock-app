import { gsap } from "gsap/gsap-core";
import type { TimePickerController } from "../types";
import { LINE_HEIGHT, TOTAL } from "../consts";

/**
 * 브라우저에서 CSS의 Animation-Timeline 속성을 지원하지 않는 경우, GSAP 기반으로 Controller가 스크롤 될 때 Wheel과 Track도 실제로 스크롤 동작을 수행시켜주는 보조 함수
 * 
 * @param {TimePickerController} controller - Wheel과 Track을 스크롤을 진행하게 해줄 대상
 */
export function animationTimeLineFallback(controller: TimePickerController) {
  const [scrollTop, maxScroll] = [controller.element.scrollTop, controller.element.scrollHeight - controller.element.offsetHeight]

  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0; 
  
  const trackBounds = controller.track.getBoundingClientRect();
  const rotationFactor = controller.type === "meridiem" ? (360 / TOTAL) : 360;

  gsap.set(controller.wheel, { rotateX: progress * rotationFactor });
  gsap.set(controller.track, { y: progress * -(trackBounds.height - LINE_HEIGHT) });
}