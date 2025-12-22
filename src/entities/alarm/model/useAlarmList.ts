import { useEffect, useState } from "react";
import type { AlarmData, HandleAddAlarmFunction } from "./alarm.types";

/**
 * Alarm 도메인 데이터를 관리하는 커스텀 훅
*/
export default function useAlarmList() {
  const [alarmList, setAlarmList] = useState<AlarmData[]>([]);

  // LocalStroage에 사용자가 지정한 알림 데이터를 가지고 온다.
  useEffect(() => {
    const alarmListDatas = localStorage.getItem("alarm");

    // 알림 데이터가 있는 경우
    if(alarmListDatas) {
      setAlarmList(JSON.parse(alarmListDatas) as AlarmData[]);
    }
  }, []);

  // 알림을 추가하는 이벤트 리스너
  const handleAddAlarm: HandleAddAlarmFunction = ({ hours, minutes, weekdays }, sheetClose) => {
    const newAlarmData: AlarmData = { id: Date.now(), hours, minutes, weekdays, active: true };
    
    // 1. AlarmList 상태를 갱신한다.
    setAlarmList((prev) => [...prev, { ...newAlarmData }]);

    // 2. 변경된 상태는 이전 가상 DOM과 새롭게 생성된 가상 DOM과 비교하여 최종적으로 반영되는 합성 가상 DOM에서
    // 새로운 상태로 갱신되기 때문에 alarmList를 바로 반영하면 사실상 이전 정보만 추가하기 때문에 동일한 로직을 구성해준다.
    localStorage.setItem("alarm", JSON.stringify([...alarmList, { ...newAlarmData }]));

    // AlarmList를 추가하고, Bottom Sheet를 닫는다.
    sheetClose()
  }

  // 알림을 삭제하는 이벤트 리스너
  const handleDeleteAlarm = (id: number | string, type?: "swipe", editModeActive?: () => void) => {
    const newAlarmData = alarmList.filter((alarm) => alarm.id !== id);
    setAlarmList(newAlarmData);
    localStorage.setItem("alarm", JSON.stringify(newAlarmData));

    // 모든 알림이 제거된 경우 editMode를 비활성화 시킨다.
    if((!newAlarmData.length || type === "swipe") && editModeActive) {
      editModeActive();
    }
  }

  // 알림을 비활성화하는 이벤트 리스너
  const handleToggleActiveAlarm = (id: number) => {
    const newAlarmData = alarmList.map((alarm) => {
      if(alarm.id === id) alarm.active = !alarm.active;
      return { ...alarm };
    });

    setAlarmList(newAlarmData);
    localStorage.setItem("alarm", JSON.stringify(newAlarmData));
  }

  return {
    alarmList,
    handleAddAlarm,
    handleDeleteAlarm,
    handleToggleActiveAlarm
  }
}
