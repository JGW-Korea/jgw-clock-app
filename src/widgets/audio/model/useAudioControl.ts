import { useContext, useEffect, useRef, useState } from "react";
import { getNextAlarmDelayMs, playAlarm } from "../lib";
import { AlarmContext } from "@entities/alarm";

export default function useAudioControl() {
  const { alarmList } = useContext(AlarmContext)!; // 사용자가 설정한 Alarm or Timer 종류를 가지고 온다.
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerIdRef = useRef<{ id: number }[]>([]);
  const [audioType, setAlarmType] = useState<"alarm" | "timer">("alarm");
  
  useEffect(() => {
    if(!audioRef.current || !alarmList.length) return; // 알림이 존재하지 않으면 Side-effect를 수행하지 않는다. (최초 마운트 시 예외 처리)

    // 사용자가 설정한 모든 알림 리스트에 대한 밀리초 값을 구한다.
    const alarmPlayMilliseconds = new Set<number>();
    for(const alarm of alarmList) {
      if(alarm.active) { // 활성화 된 알림에 대해서만 밀리초 값을 구한다.
        alarmPlayMilliseconds.add(
          getNextAlarmDelayMs(
            alarm.hours,
            alarm.minutes,
            alarm.weekdays.map(el => el.numberValue)
          )
        );
      }
    }

    // 모든 알림에 대한 밀리초를 가장 짧은 시간으로 정렬하여 setTimeout을 통해 일정 시간 후 알림을 울리게 만든다.
    [...alarmPlayMilliseconds].sort((a, b) => a - b).forEach((millisecond) => {
      const timerId = setTimeout(() => {
        // Audio가 현재 울리고 있는 상태라면 audio를 재실행하지 않고 그냥 넘겨버린다.
        if(!audioRef.current?.paused) {
          return;
        }

        setAlarmType("alarm");
        playAlarm(audioRef.current); // 알림을 울리게 만든다.
      }, millisecond);

      timerIdRef.current.push({ id: timerId });
    });

    return () => {
      timerIdRef.current.forEach((timer) => clearTimeout(timer.id)); // 모든 타이머 이벤트를 비활성화 시킨다.
      timerIdRef.current = []; // 리렌더링이 발생하면서 타이머 아이디가 추가되는데 이때 기존 값이 남아있으면 누적이 될 수 있기 때문에 빈배열로 초기화해준다.
    }
  }, [alarmList]);
  
  const handleAudioHidden = () => {
    if(!audioRef.current) return;

    // 오디오 재생을 중단시키고, 안보이게 만든다.
    audioRef.current.pause();
    audioRef.current.parentElement!.style.top = "-20rem";
  }

  return {
    audioRef,
    enable: !!alarmList.length,
    audioType,
    handleAudioHidden
  }
}
