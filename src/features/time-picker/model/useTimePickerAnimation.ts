import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { setScrollPositionByCurrentTime } from "../lib";

export default function useTimePickerAnimation() {
  const meridiemRef = useRef<HTMLUListElement>(null);
  const hoursRef = useRef<HTMLUListElement>(null);
  const minutesRef = useRef<HTMLUListElement>(null);

  // 
  useGSAP(() => {
    if(!meridiemRef.current || !hoursRef.current || !minutesRef.current) return;

    // 1. TimePicker의 스크롤 위치를 현재 시간대에 맞춘다.
    setScrollPositionByCurrentTime(
      meridiemRef.current,
      hoursRef.current,
      minutesRef.current
    );

  }, { dependencies: [] });

  return {
    meridiemRef,
    hoursRef,
    minutesRef
  }
}