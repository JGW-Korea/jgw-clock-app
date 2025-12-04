const BUFFER = 2;

/**
 * Picker Wheel의 무한 스크롤을 위한 유틸 함수
 * - Buffer: 최상단 / 최하단의 영역을 나타내기 위한 상수 (* 실제 요소에 끝단을 지정하는 값을 사용하는 것이 아닌 단순 계산으로 끝단을 구하기 위한 용도)
 * - scrollTop < BUFFER: 현재 위치가 Buffer보다 작을 경우 최상단으로 간주하여 최하단으로 스크롤 위치를 이동시킨다.
 * - scrollTop + offsetHeight > scrollHeight - BUFFER: 현재 위치가 전체 Wheel 영역보다 큰 경우 최하단으로 간주하여 최상단으로 스크롤 위치를 이동시킨다.
 * @param event 
 * @returns 
 */
export function maintainInfinieScroll(event: Event): void {
  if(!event.target) return;

  const target = event.target as HTMLElement;

  if(target.scrollTop < BUFFER) target.scrollTop = target.scrollHeight - target.offsetHeight - BUFFER; // 스크롤이 상단 끝에 도달했을 때 -> 하단(index 마지막 위치)으로 이동시킨다.
  if(target.scrollTop + target.offsetHeight > target.scrollHeight - BUFFER) target.scrollTop = BUFFER; // 스크롤이 하단 끝에 도달했을 때 -> 상단(index 첫번째 위치)으로 이동시킨다.
}