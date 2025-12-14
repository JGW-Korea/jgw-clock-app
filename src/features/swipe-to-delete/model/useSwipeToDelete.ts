import { useRef } from "react";
import { SWIPE_OPEN_LIMIT, SWIPE_THRESHOLD } from "../consts";

/**
 * List Item의 Swipe를 활성화 시키는 커스텀 훅
 * 
 * @param {React.RefObject<HTMLLinkElement | null>} activeRef - 이전 Pointer 발생으로 등록된 List Item
*/
export default function useSwipeToDelete(activeRef: React.RefObject<HTMLLIElement | null>) {
  const listItemRef = useRef<HTMLLIElement>(null);

  /** 인풋 장치(마우스, 펜, 터치 등)를 통해 ListItem을 클릭한 좌표를 저장한다. */
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if(!listItemRef.current) return; // 드래그 대상이 될 요소가 지정되지 않은 경우 아무것도 하지 않고 함수를 종료한다.

    // 다른 List Item이 Swipe가 활성화되어 있으면, 비활성화 시킨다.
    if(activeRef.current && activeRef.current !== listItemRef.current) {
      activeRef.current.style.setProperty("--translate-x", "0");
      delete activeRef.current.dataset.pressStartX;
    }

    // 다른 List Item의 Swipe가 모두 비활성화 된 경우 현재 ListItem의 클릭 좌표를 저장한다.
    activeRef.current = listItemRef.current;
    listItemRef.current.dataset.pressStartX = `${Math.floor(event.clientX)}`
  }

  /** 인풋 장치를 통해 누른 위치에서 얼마만큼의 이동이 발생했는지 영역을 계산하여 translateX 값을 이동시킨다. */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if(!listItemRef.current || !listItemRef.current.dataset.pressStartX) {
      return;
    }

    // Pointer 이동 계산에 필요한 List Item을 누른 위치와 더불어 Pointer 이동 좌표를 가지고 온다.
    const [pressStartX, clientX] = [
      Number(listItemRef.current.dataset.pressStartX),
      event.clientX
    ];
    
    // 처음 누른 위치부터 현재 얼마만큼의 이동이 발생했는지 계산한다.
    // 계산한 값을 바탕으로 Swipe의 최소 기준점을 넘겼을 경우에만 실제 translateX의 이동을 발생시킨다.
    const moveValue = clientX - pressStartX;
    if(Math.abs(moveValue) < SWIPE_THRESHOLD) {
      return;
    }

    // 기준점을 넘겼을 경우 실제 TranslateX를 이동시킨다.
    let translate;
    if(moveValue <= SWIPE_OPEN_LIMIT) translate = -SWIPE_OPEN_LIMIT;
    else {
      translate = 0;
    }

    listItemRef.current.style.setProperty("--translate-x", `${translate}`);

    // Toggle Switch 투명도 낮춤
    const toggleSwitchEl = listItemRef.current.querySelector("div[class*=content-toggle]") as HTMLDivElement;
    if(toggleSwitchEl) {
      toggleSwitchEl.style.filter = "opacity(0)";
    }
  }

  /** 인풋 장치가 List Item을 벗어나거나 눌렀다 땠을 경우 초기화 작업을 진행하는 보조 함수 */
  const handlePointerEnd = () => {
    if(!listItemRef.current) return;

    // Pointer Event가 종료되었을 때 CSS 변수로 저장된 translate 이동 좌표 값을 가지고온다.
    const currentTranslate = Number(listItemRef.current.style.getPropertyValue("--translate-x")) || 0;

    // 이동된 좌표 값이 Swipe가 활성화 될 절반 이상이 이동되었으면, 완전히 활성화 시키고 그렇지 않으면 비활성화 시킨다.
    if(currentTranslate <= -(SWIPE_OPEN_LIMIT / 2)) listItemRef.current.style.setProperty("--translate-x", `${-SWIPE_OPEN_LIMIT}`);
    else {
      listItemRef.current.style.setProperty("--translate-x", "0");
      
      // Toggle Switch 투명도 올림
      const toggleSwitchEl = listItemRef.current.querySelector("div[class*=content-toggle]") as HTMLDivElement;
      if(toggleSwitchEl) {
        toggleSwitchEl.style.filter = "opacity(1)";
      }
    }

    delete listItemRef.current.dataset.pressStartX;
  }

  return {
    listItemRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  };
}