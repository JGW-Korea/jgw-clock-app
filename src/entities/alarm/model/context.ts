import { createContext } from "react";
import type { AlarmData, HandleAddAlarmFunction } from "./alarm.types";
import type { EditMode } from "@features/list-edit";

// Context Value 타입 구성
export interface AlarmContextType {
  alarmList: AlarmData[];
  handleAddAlarm: HandleAddAlarmFunction;
  handleDeleteAlarm: (id: number | string, type?: "swipe", editModeActive?: (type: keyof EditMode) => void) => void;
  handleToggleActiveAlarm: (id: number) => void;
}

/** Alarm 전역 상태를 관리하기 위한 Context 객체 */
export const AlarmContext = createContext<AlarmContextType | null>(null);