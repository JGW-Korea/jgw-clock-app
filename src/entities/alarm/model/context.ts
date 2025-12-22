import { createContext } from "react";
import type { AlarmData, HandleAddAlarmFunction } from "./alarm.types";

// Context Value 타입 구성
interface AlarmContext {
  alarmList: AlarmData[];
  handleAddAlarm: HandleAddAlarmFunction;
  handleDeleteAlarm: (id: number | string, type?: "swipe", editModeActive?: () => void) => void;
  handleToggleActiveAlarm: (id: number) => void;
}

/** Alarm 전역 상태를 관리하기 위한 Context 객체 */
export const AlarmContext = createContext<AlarmContext | null>(null);