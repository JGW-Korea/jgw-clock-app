// Weekday 객체 구성
// - numberValue: 실제 계산에 사용되는 요일
// - stringValue: 화면에 노출하기 위해 사용되는 요일
type Weekday = { numberValue: number, stringValue: string };

// Context value 타입 구성
export interface ClockContextType {
  alarmList: AlarmData[];
  handleAddAlarm: handleAddAlarmFunction;
}

// LocalStorage에 저장되는 AlarmData 타입
export interface AlarmData {
  id: number;
  hours: number;
  minutes: number;
  weekday: {
    numberValue: number;
    stringValue: string;
  }[]
}


export type handleAddAlarmFunction = (hours: number, minutes: number, weekday: Weekday[]) => void; // 알림 데이터를 추가하는 이벤트 리스너
