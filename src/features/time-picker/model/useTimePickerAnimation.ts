import { useGSAP } from "@gsap/react";
import { useRef } from "react"
import { animationTimeLineFallback, createScrollWatcher, fallbackUpdateController, setScrollPositionByCurrentTime, syncMeridiem } from "../lib";
import type { TimePickerController, TimePickerState } from "../types";
import { getScrollIndex, maintainInfiniteLoop } from "../utils";

export default function useTimePickerAnimation() {
  const meridiemRef = useRef<HTMLUListElement>(null);
  const hoursRef = useRef<HTMLUListElement>(null);
  const minutesRef = useRef<HTMLUListElement>(null);

  const state: TimePickerState = {
    isPMState: false,
    currentHours: 0,
    currentMinutes: 0,
    prevWrapped: null,
    prevUnwrapped: null,
    meridiemOverride: false,
    lastOverride: false,
    passiveTrigger: false,
    meridiemStart: null,
    meridiemGuard: false
  };

  // useGSAP Hook -> useEffect와 동일하게 의존성(dependencies) 항목에 따른 렌더링･리렌더링 간에 부수효과(side-effect) 로직을 수행한다.
  // 단순히 useEffect와 동일한 것이 아닌 GSAP을 통해 등록한 애니메이션을 "자동으로 해제"하여 메모리 낭비를 방지한다.
  useGSAP(() => {
    if(!meridiemRef.current || !hoursRef.current || !minutesRef.current) return;

    // 실제 DOM에 연결한 참조 객체를 배열로 관리한다.
    // 단, 브라우저에서 animation-timeline을 지원하지 않는 경우 wheel과 track에도 실제 DOM을 연결해준다.
    // 왜냐하면, animation-timeline을 지원하지 않으면 스크롤이 수행되지 않기 때문에 gsap을 통해 대체를 해줘야하기 때문이다.
    const controllers: TimePickerController[] = [
      { type: "meridiem", element: meridiemRef.current, wheel: null, track: null },
      { type: "hours", element: hoursRef.current, wheel: null, track: null },
      { type: "minutes", element: minutesRef.current, wheel: null, track: null },
    ];
    if(!CSS.supports("animation-timeline: scroll()")) { 
      fallbackUpdateController(controllers);
    }

    setScrollPositionByCurrentTime(state, controllers); // TimePicker의 스크롤 위치를 현재 시간을 기준으로 지정한다.

    // TimePicker Controller에 스크롤 추적을 위한 스크롤 추적 보조 함수를 등록한다.
    controllers.forEach((controller) => {
      createScrollWatcher(controller.element, {
        onStart: () => {
          switch(controller.type) {
            case "meridiem": {
              state.meridiemStart = getScrollIndex(controller.element, true);
              break;
            }
            case "hours": {
              state.meridiemGuard = true;
              break
            }
          }
        },
        onFrame(number) {
          // animation-timeline을 지원하지 않는 브라우저인 경우 gsap을 통해 wheel과 track을 스크롤 가능하게 해준다.
          if(!CSS.supports("animation-timeline: scroll()")) {
            animationTimeLineFallback(controller);
          }
          
          if(controller.type !== "meridiem") {
            maintainInfiniteLoop(controller.element);           // 스크롤 수행 도중에 스크롤 위치의 끝단(최하단 / 최상단)에 도달했을 때 스크롤을 멈추지 않고 무한 스크롤을 해주는 보조 함수
          }

          const index = getScrollIndex(controller.element);   // 

          switch(controller.type) {
            case "hours": {
              syncMeridiem(index, state, controllers);
              state.currentHours = index;
              break;
            }
            case "minutes": {
              state.currentMinutes = index;
              break;
            }
          }
        },
        onStop: () => {
          switch(controller.type) {
            case "meridiem": {
              const idx = getScrollIndex(controller.element, true);

              if(state.passiveTrigger) state.passiveTrigger = false;
              else if(state.meridiemStart !== null && idx !== state.meridiemStart && !state.meridiemGuard) {
                state.isPMState = idx === 1;
                state.meridiemOverride = !state.meridiemOverride;
              }

              state.meridiemStart = null;
              break;
            }
            case "hours": {
              state.meridiemGuard = false;
              break;
            }
          }
        }
      });
    });

  }, { dependencies: [] });

  return {
    meridiemRef,
    hoursRef,
    minutesRef
  };
}
