import { useGSAP } from "@gsap/react";
import { useRef } from "react"
import { createScrollWatcher, setScrollPositionByCurrentTime } from "../lib";
import type { TimePickerState } from "../types";

export default function useTimePickerAnimation() {
  const meridiemRef = useRef<HTMLUListElement>(null);
  const hoursRef = useRef<HTMLUListElement>(null);
  const minutesRef = useRef<HTMLUListElement>(null);

  const state: TimePickerState = { isPMState: false };

  // useGSAP Hook -> useEffect와 동일하게 의존성(dependencies) 항목에 따른 렌더링･리렌더링 간에 부수효과(side-effect) 로직을 수행한다.
  // 단순히 useEffect와 동일한 것이 아닌 GSAP을 통해 등록한 애니메이션을 "자동으로 해제"하여 메모리 낭비를 방지한다.
  useGSAP(() => {
    if(!meridiemRef.current || !hoursRef.current || !minutesRef.current) return;

    const refs: HTMLUListElement[] = [
      meridiemRef.current,
      hoursRef.current,
      minutesRef.current,
    ];

    setScrollPositionByCurrentTime(state, refs); // TimePicker의 스크롤 위치를 현재 시간을 기준으로 지정한다.

    // TimePicker Controller에 스크롤 추적을 위한 스크롤 추적 보조 함수를 등록한다.
    refs.forEach((ref) => {
      createScrollWatcher(ref, {
        onStart: () => {},
        onFrame: () => {},
        onStop: () => {}
      });
    });

  }, { dependencies: [] });

  return {
    meridiemRef,
    hoursRef,
    minutesRef
  };
}