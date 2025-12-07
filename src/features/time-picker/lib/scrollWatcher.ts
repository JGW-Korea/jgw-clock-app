import type { ScrollWatcher, ScrollWatcherReturn } from "../types";
import { getScrollPosition } from "../utils";

/**
 * TimePicker > Controller의 스크롤 수행을 감지하는 보조 함수
 * 
 * @param {HTMLElement} target - 스크롤 수행을 감지 대상이 될 실제 DOM 요소
 * @param {ScrollWatcher} ScrollWatcher - 스크롤 감지 중 발생시킬 함수
*/
export function createScrollWatcher(target: HTMLElement, { frames = 20, onStart, onFrame, onStop }: ScrollWatcher): ScrollWatcherReturn {
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