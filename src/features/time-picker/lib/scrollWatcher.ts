import type { ScrollWatcher, ScrollWatcherReturn, TimePickerController, TimePickerState } from "../types";
import { getScrollIndex, getScrollPosition, maintainInfiniteLoop, setProxyRotationFromIndex } from "../utils";
import { animationTimeLineFallback } from "./animationTimeLineFallback";
import { syncMeridiem } from "./toggleMeridiem";

/**
 * TimePicker > Controller의 스크롤 수행을 감지하는 보조 함수
 * 
 * @param {HTMLElement} target - 스크롤 수행을 감지 대상이 될 실제 DOM 요소
 * @param {ScrollWatcher} ScrollWatcher - 스크롤 감지 중 발생시킬 함수
*/
function createScrollWatcher(target: HTMLElement, { frames = 20, onStart, onFrame, onStop }: ScrollWatcher): ScrollWatcherReturn {
  let last: number | null = null;  // 마지막 프레임에서의 scrollTop의 값을 저장한다.
  let repeats: number = 0;         // 정지 상태가 얼마나 지속되는지 추적하기 위한 값을 저장한다.
  let raf: number | null = null;   // requestAnimationFrameID의 값을 저장한다.

  // TimePicker Controller의 스크롤이 수행되고 있는 경우
  const runFrame = () => {
    const position = getScrollPosition(target);
    onFrame?.(position);

    const hasChanged = position !== last;
    repeats = hasChanged ? 1 : repeats + 1;
    last = position;

    if(repeats >= frames) {
      onStop?.();
      cancelAnimationFrame(raf!);
      raf = null;
      last = null;
      repeats = 0;
      target.addEventListener("scroll", handleScrollTrigger, { once: true, passive: true, });
      return;
    }

    raf = requestAnimationFrame(runFrame);
  }

  // TimePicker Controller의 스크롤 이벤트 발생했을 때 수행되는 동작 (이벤트 리스너)
  const handleScrollTrigger = () => {
    onStart?.();

    // requestAnimationFrame이 등록되지 않은 경우
    if(!raf) {
      last = getScrollPosition(target);       // <- 현재 스크롤 된 높이 값을 저장한다.
      repeats = 1;                            // <- 정지 상태를 1로 지정한다.
      raf = requestAnimationFrame(runFrame);  // <- requestAnimationFrameID를 저장한다.
    }
  }

  // TimePicker Controller의 스크롤 이벤트 리스너를 등록한다.
  // once    -> 이벤트가 한 번 발생 후 등록된 이벤트를 제거하는 속성
  // passive -> 기본 동작을 막지 않도록 설정
  target.addEventListener("scroll", handleScrollTrigger, { once: true, passive: true, });

  return {
    destroy() {
      if(raf) {
        cancelAnimationFrame(raf);
      }
      
      // once 속성을 통해 scroll 이벤트가 발생하면 등록된 이벤트는 자동으로 삭제된다.
      // 그러나, 이벤트를 발생시키지 않고 언마운트가 되면 불필요한 이벤트 참조가 유지되기 때문에 명시적으로 제거해준다.
      target.removeEventListener("scroll", handleScrollTrigger);
    }
  }
}

/**
 * TimePicker Controller의 스크롤 추적 함수를 등록하는 보조 함수
 * 
 * @param {TimePickerController} controller - 스크롤 수행 감지 대상이 될 실제 DOM 요소
 * @param {HTMLDivElement} proxy - Controller의 드래그 대상이 될 중간자(proxy) 요소
 * @param {HTMLUListElement} meridiem - Hours 스크롤 변화로 인해 AM <-> PM 자동 전환이 될 실제 Meridiem DOM 요소
 * @param {TimePickerState} state - 컴포넌트 내부에서 관리하는 스크롤 전체 상태
 * @returns {ScrollWatcher} - 등록한 ScrollWatcher
*/
export function registerScrollWatcher(controller: TimePickerController, proxy: HTMLDivElement, meridiem: HTMLUListElement, state: TimePickerState): ScrollWatcherReturn {
  return createScrollWatcher(controller.element, {
    // 스크롤이 시작된 경우
    onStart() {
      switch(controller.type) {
        case "meridiem": {
          state.meridiemStart = getScrollIndex(controller.element, true);
          break;
        }
        case "hours": {
          state.meridiemGuard = true;
          break;
        }
      }
    },
    // 스크롤이 수행되고 있는 경우
    onFrame() {
      // 스크롤 수행 과정에서 CSS의 animation-timeline을 지원하지 않으면 JavaScript를 통해 대체한다.
      if(!CSS.supports("animation-timeline: scroll()")) { 
        animationTimeLineFallback(controller);
      }

      // 스크롤 수행 과정에서 수행해야 할 로직 등록
      // - hours, minutes는 스크롤을 멈추지 않게 하기 위해 무한 스크롤 보조 함수를 등록한다.
      // - hours는 스크롤 과정에서 AM <-> PM을 자동으로 전환을 해줘야하기 때문에 현재 선택된 높이의 index를 계속 추적해서 AM <-> PM을 자동으로 전환시킨다.
      switch(controller.type) {
        case "hours": {
          const currentHoursIndex = getScrollIndex(controller.element);
          
          maintainInfiniteLoop(controller.element);         // 무한 스크롤 유지
          syncMeridiem(currentHoursIndex, state, meridiem); // AM <-> PM 자동 전환
          break;
        }
        case "minutes": {
          maintainInfiniteLoop(controller.element);         // 무한 스크롤 유지
          break;
        }
      }
    },
    // 스크롤이 중단된 경우
    onStop() {
      switch(controller.type) {
        case "meridiem": {
          const currentMeridiemIndex = getScrollIndex(controller.element, true); // 스크롤 중단 시점의 현재 위치를 가지고 온다.

          if(state.passiveTrigger) state.passiveTrigger = false;
          else if(state.meridiemStart && currentMeridiemIndex !== state.meridiemStart && !state.meridiemGuard) {
            state.isPMState = currentMeridiemIndex === 1;
            state.meridiemOverride = !state.meridiemOverride;
          }

          state.meridiemStart = null;
          setProxyRotationFromIndex(proxy, currentMeridiemIndex); // 스크롤이 중단 된 경우 Wheel의 드래그 대상이 될 중간자 요소의 높이도 현재 스크롤 높이와 동일하게 맞춰준다.
          break;
        }
        case "hours": {
          const currentHoursIndex = getScrollIndex(controller.element); // 스크롤 중단 시점의 현재 위치를 가지고 온다.

          state.currentHours = currentHoursIndex;
          state.meridiemGuard = false;
          setProxyRotationFromIndex(proxy, currentHoursIndex); // 스크롤이 중단 된 경우 Wheel의 드래그 대상이 될 중간자 요소의 높이도 현재 스크롤 높이와 동일하게 맞춰준다.
          break;
        }
        case "minutes": {
          const currentMinutesIndex = getScrollIndex(controller.element); // 스크롤 중단 시점의 현재 위치를 가지고 온다.
          
          state.currentMinutes = currentMinutesIndex;
          setProxyRotationFromIndex(proxy, currentMinutesIndex); // 스크롤이 중단 된 경우 Wheel의 드래그 대상이 될 중간자 요소의 높이도 현재 스크롤 높이와 동일하게 맞춰준다.
          break;
        }
      }
    }
  });
}