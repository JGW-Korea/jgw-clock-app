import { useEffect, useRef, useState } from "react";
import type { WordTimeListType } from "@entities/world";
import { updateTime } from "../lib";

export interface TimeStatus {
  day: "Yesterday" | "Today" | "Tomorrow";
  target: "AM" | "PM";
  time: string;
}

/**
 * 사용자가 지정한 도시가 있을 경우 해당 도시의 시간을 사용자 시간대와 차이를 구하고, 일정 간격 동안 시간을 계산하게 하는 커스텀 훅
 * 
 * @param {WordTimeListType} world - 사용자가 설정한 도시 정보
*/
export default function useTimeContinue(world: WordTimeListType) {
  const [timeStatus, setTimeStatus] = useState<TimeStatus>({
    day: "Today",
    target: "AM",
    time: ""
  });
  const intervalIdRefs = useRef<number[]>([]);

  // 현재 시간대와 사용자가 지정한 각 도시의 시간대의 차이를 계산하는 로직
  // 각 도시마다 일정 간격 동안 시간대를 계산하는 로직
  useEffect(() => {
    // 최초 마운트 시 현재 시간대와 사용자가 지정한 도시의 시간대의 차이를 계산해서 상태에 반영한다.
    updateTime(world, setTimeStatus);
    
    // setInterval을 통해 일정 간격마다 시간을 계산하고, 컴포넌트 언마운트 시 비동기로 인해 메모리에 점유되고 있는 타이머 함수를 제거한다.
    const delay = (60 - new Date().getSeconds()) * 1000;

    const timerId = setTimeout(() => {
      updateTime(world, setTimeStatus);
      
      const intervalId = setInterval(() => {
        updateTime(world, setTimeStatus);
      }, 1000 * 60);
      intervalIdRefs.current.push(intervalId);
    }, delay);

    return () => {
      clearTimeout(timerId);
      if(intervalIdRefs.current.length) {
        intervalIdRefs.current.forEach((id) => {
          clearInterval(id);
        });
      }
    }
  }, []);

  return { timeStatus };
}