import gsap from "gsap";
import type { TimePickerController } from "../types";

/**
 * 브라우저에서 CSS의 Animation-Timeline 속성을 지원하지 않는 경우, Controller의 wheel과 track 프로퍼티에 해당 실제 DOM 요소를 삽입한다.
 * 
 * @param {TimePickerController[]} controllers - TimePicker 내부의 각 Controller 요소
*/
export function fallbackUpdateController(controllers: TimePickerController[]) {
  controllers.forEach((controller) => {
    controller.wheel = controller.element.nextElementSibling as HTMLElement;
    controller.track = controller.element.nextElementSibling!.nextElementSibling!.firstElementChild as HTMLElement;
  });
}

/**
 * 브라우저에서 CSS의 Animation-Timeline 속성을 지원하지 않는 경우, GSAP을 기반으로 Controller가 스크롤 될 때 Wheel과 Track도 실제로 스크롤 동작을 수행시켜준다.
 * 
 * @param {TimePickerController} controller - Wheel과 Track을 스크롤을 진행하게 해줄 대상
*/
export function animationTimeLineFallback(controller: TimePickerController) {
  if(!controller.wheel || !controller.track) return;
  
  const scrollTop = controller.element.scrollTop;
  const maxScroll = controller.element.scrollHeight - controller.element.offsetHeight;
  const progress = scrollTop / maxScroll;
  const trackBounds = controller.track.getBoundingClientRect();

  gsap.set(controller.wheel, { rotateX: progress * 360 });
  gsap.set(controller.track, { y: progress * -(trackBounds.height - 34) })
}