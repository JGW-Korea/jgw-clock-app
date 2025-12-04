// --------------------------------------------
// 스크롤을 무한으로 유지하기 위한 유틸 함수들
// --------------------------------------------

/**
 * 스크롤 "스크롤 시작 / 스크롤 중 / 스크롤 중단"을 감지하는 함수
*/
export function createScrollWatcher(el: HTMLUListElement | null, { frames = 20, onStart, onFrame, onStop }: any) {
  if(!el) return;

  let rafId: number | null = null;
  let last = 0;
  let repeat = 0;

  const getTop = () => el.scrollTop;

  const frame = () => {
    const current = getTop();
    onFrame?.();

    if(current !== last) repeat = 0;
    else repeat += 1;

    last = current;

    if(repeat >= frames) {
      rafId && cancelAnimationFrame(rafId);
      rafId = null;
      onStop?.();
      return;
    }

    rafId = requestAnimationFrame(frame);
  }

  const kick = () => {
    onStart?.();
    if(!rafId) {
      last = getTop();
      rafId = requestAnimationFrame(frame);
    }
  }

  el.addEventListener("scroll", kick);

  return {
    destroy() {
      el.removeEventListener("scroll", kick);
      rafId && cancelAnimationFrame(rafId);
    }
  }
}

/**
 * 스크롤 도중 스크롤의 위치가 시작 부분 또는 마지막 부분일 경우 스크롤의 위치를 옮기는 작업을 수행하는 함수
*/
export function fixInfiniteScroll(el: HTMLUListElement | null, buffer = 2) {
  if(!el) return;
  
  const { offsetHeight: itemH, scrollTop, scrollHeight } = el;

  if(itemH + scrollTop > scrollHeight - buffer) el.scrollTop = buffer;
  if(scrollHeight < buffer) el.scrollTop = scrollHeight - buffer;
}