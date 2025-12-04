import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { 
  maintainInfinieScroll,
  setScrollPositionByCurrentTime,
} from "../lib";

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

    // 2. TimePicker 무한 스크롤을 위한 이벤트 리스너 등록
    meridiemRef.current.addEventListener("scroll", maintainInfinieScroll);
    hoursRef.current.addEventListener("scroll", maintainInfinieScroll);
    minutesRef.current.addEventListener("scroll", maintainInfinieScroll);

    // 클린업 함수(clean-up) -> 불필요한 참조를 유지하고 있는 메모리 제거를 위한 용도
    return () => {
      meridiemRef.current?.removeEventListener("scroll", maintainInfinieScroll);
      hoursRef.current?.removeEventListener("scroll", maintainInfinieScroll);
      minutesRef.current?.removeEventListener("scroll", maintainInfinieScroll);
    }
  }, { dependencies: [] });

  return {
    meridiemRef,
    hoursRef,
    minutesRef
  }
}