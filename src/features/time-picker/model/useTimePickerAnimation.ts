import { useGSAP } from "@gsap/react";
import { useRef } from "react"
import { 
  setScrollPositionByCurrentTime,
  registerScrollWatcher,
} from "../lib";
import type { ScrollWatcherReturn, TimePickerController, TimePickerState } from "../types";

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

  // useGSAP Hook -> useEffect와 동일하게 의존성(dependencies) 항목에 따른 컴포넌트 생명주기 간에 부수효과(side-effect) 로직을 수행한다.
  // 단순히 useEffect와 동일한 것이 아닌 GSAP을 통해 등록한 애니메이션을 "자동으로 해제"하여 메모리 낭비를 방지한다.
  useGSAP(() => {
    if(!meridiemRef.current || !hoursRef.current || !minutesRef.current) return;

    // 실제 DOM에 연결한 참조 객체를 배열로 관리한다.
    const controllers: TimePickerController[] = [
      { type: "meridiem", element: meridiemRef.current, wheel: meridiemRef.current.nextElementSibling as HTMLElement, track: meridiemRef.current.nextElementSibling!.nextElementSibling!.firstElementChild as HTMLElement },
      { type: "hours", element: hoursRef.current, wheel: hoursRef.current.nextElementSibling as HTMLElement, track: hoursRef.current.nextElementSibling!.nextElementSibling!.firstElementChild as HTMLElement },
      { type: "minutes", element: minutesRef.current, wheel: minutesRef.current.nextElementSibling as HTMLElement, track: minutesRef.current.nextElementSibling!.nextElementSibling!.firstElementChild as HTMLElement },
    ];

    // --------------------------------------------
    // TimePicker를 조작할 수 있는 로직을 구성한다.
    // - TimePicker의 스크롤 위치를 현재 시간을 기준으로 지정한다.
    // - 각 TimePicker Controller의 스크롤 시작･스크롤 수행 중･스크롤 중단을 추적하는 함수를 등록한다.
    // - TimePicker Controller를 마우스 휠로 스크롤을 하는 것이 아닌 드래그를 할 경우 GSAP 기반 애니메이션을 등록한다.
    // --------------------------------------------

    setScrollPositionByCurrentTime(state, controllers); // 1. TimePicker의 스크롤 위치를 현재 시간을 기준으로 지정한다.

    // 2. 각 TimePicker Controller에 스크롤 추적 함수를 등록한다.
    // - scrollWatchers라는 배열을 두는 이유는 생성된 스크롤 추적 함수는 addEventListner와 같이 메모리를 점유하기 때문에,
    // - 컴포넌트가 언마운트가 되면 계속해서 메모리를 점유하는 것이 아닌 removeEventListener를 통해 메모리에서 해제하기
    const scrollWatcher: ScrollWatcherReturn[] = [];
    controllers.forEach((controller) => {
      scrollWatcher.push(
        registerScrollWatcher(
          controller,
          controllers[0].element,
          state
        )
      );
    });

  }, { dependencies: [] });

  return {
    meridiemRef,
    hoursRef,
    minutesRef
  };
}
