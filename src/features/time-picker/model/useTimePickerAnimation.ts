import { useGSAP } from "@gsap/react";
import { useRef } from "react"
import { 
  setScrollPositionByCurrentTime,
  registerScrollWatcher,
  registerDraggable
} from "../lib";
import type { ScrollWatcherReturn, TimePickerController, TimePickerState } from "../types";
import { getScrollIndex, setProxyRotationFromIndex } from "../utils";
import { gsap } from "gsap/gsap-core";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";

export default function useTimePickerAnimation(updateTimePicker: (isPM: boolean, hours: number, minutes: number) => void) {
  const meridiemRef = useRef<HTMLUListElement>(null);
  const hoursRef = useRef<HTMLUListElement>(null);
  const minutesRef = useRef<HTMLUListElement>(null);

  // TimePicker 내부 제어 상태
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

    gsap.registerPlugin(Draggable, InertiaPlugin);

    // 실제 DOM에 연결한 참조 객체를 배열로 관리한다.
    const controllers: TimePickerController[] = [
      { type: "meridiem", element: meridiemRef.current, wheel: meridiemRef.current.nextElementSibling as HTMLDivElement, track: meridiemRef.current.nextElementSibling!.nextElementSibling!.firstElementChild as HTMLDivElement },
      { type: "hours", element: hoursRef.current, wheel: hoursRef.current.nextElementSibling as HTMLDivElement, track: hoursRef.current.nextElementSibling!.nextElementSibling!.firstElementChild as HTMLDivElement },
      { type: "minutes", element: minutesRef.current, wheel: minutesRef.current.nextElementSibling as HTMLDivElement, track: minutesRef.current.nextElementSibling!.nextElementSibling!.firstElementChild as HTMLDivElement },
    ];

    // 드래그 대상이 될 중간자(proxy) 요소를 지정
    const proxys: HTMLDivElement[] = Array.from({ length: controllers.length }, () => document.createElement("div"));

    // --------------------------------------------
    // TimePicker를 조작할 수 있는 로직을 구성한다.
    // - TimePicker의 스크롤 위치를 현재 시간을 기준으로 지정한다.
    // - 각 TimePicker Controller의 스크롤 시작･스크롤 수행 중･스크롤 중단을 추적하는 함수를 등록한다.
    // - TimePicker Controller를 마우스 휠로 스크롤을 하는 것이 아닌 드래그를 할 경우 GSAP 기반 애니메이션을 등록한다.
    // --------------------------------------------

    // 1. TimePicker의 스크롤 위치를 현재 시간을 기준으로 지정한다.
    // - 스크롤 위치를 현재 시간을 기준으로 맞추게 되면, 드래그 대상이 될 Proxy 요소는 수정된 스크롤 위치와 회전 각도가 달라진다.
    // - 이로 인해, setProxyRotationFromIndex 유틸 함수를 통해 Proxy 요소도 수정된 스크롤 위치와 동일한 회전 각도를 가지게 구성한다.
    setScrollPositionByCurrentTime(state, controllers, updateTimePicker);
    controllers.forEach((controller, idx) => {
      setProxyRotationFromIndex(
        proxys[idx],
        getScrollIndex(controller.element, controller.type === "meridiem")
      );
    });

    // 2. 각 TimePicker Controller에 "스크롤 추적 함수"를 등록한다.
    // 3. 각 TimePicker Controller에 "GSAP 기반 Draggable 이벤트"를 등록한다.
    const scrollWatchers: ScrollWatcherReturn[] = [];
    const draggable: (Draggable[])[] = [];
    controllers.forEach((controller, idx) => {
      scrollWatchers.push(registerScrollWatcher({ controller, proxy: proxys[idx], meridiem: controllers[0].element, state, updateTimePicker }));
      draggable.push(registerDraggable({ proxy: proxys[idx], controller, controllers, state, updateTimePicker }));
    });

    // 클린업(clean-up) 함수 컴포넌트가 언마운트 됬을 때 불필요한 메모리를 제거하기 위한 용도
    return () => {
      scrollWatchers.forEach((scrollWatcher) => {
        scrollWatcher.destroy();
      });

    }

  }, { dependencies: [] });

  return {
    meridiemRef,
    hoursRef,
    minutesRef
  };
}
