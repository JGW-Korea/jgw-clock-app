const getItemH = (current: HTMLUListElement) => {
  return current.children[0].clientHeight;
}

/**
 * TimePicker 최초 마운트 시 스크롤 위치를 현재 시간대로 선정하는 유틸 함수
 * @param meridiemCurrent - 정오 구분 열 실제 DOM 참조 객체
 * @param hoursCurrent - 시(hours) 구분 열 실제 DOM 참조 객체
 * @param minutesCurrent - 분(minutes) 구분 열 실제 DOM 참조 객체
*/
export function setScrollPositionByCurrentTime(meridiemCurrent: HTMLUListElement, hoursCurrent: HTMLUListElement, minutesCurrent: HTMLUListElement) {
  // 현재 시간대를 가지고 온다.
  const now = new Date();
  const [hours, minutes] = [now.getHours(), now.getMinutes()];

  // 현재 시간을 기준으로 스크롤의 위치를 계산하여 위치를 선정한다.
  meridiemCurrent.scrollTo({ top: (hours >= 12 ? 1 : 0) * getItemH(meridiemCurrent) });
  hoursCurrent.scrollTo({ top: (hours % 12 || 12) * getItemH(meridiemCurrent) });
  minutesCurrent.scrollTo({ top: minutes * getItemH(meridiemCurrent) });
}