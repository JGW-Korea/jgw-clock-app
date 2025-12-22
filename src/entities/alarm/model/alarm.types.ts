// Weekday 객체 구성
// - numberValue: 실제 계산에 사용되는 요일
// - stringValue: 화면에 노출하기 위해 사용되는 요일
export type Weekday = { numberValue: number, stringValue: string };

export type AlarmState = {
  hours: number;
  minutes: number;
  weekdays: Weekday[];
}

// LocalStorage에 저장되는 AlarmData 타입
export interface AlarmData {
  id: number;
  hours: number;
  minutes: number;
  weekdays: Weekday[];
  active: boolean;
}

export type HandleAddAlarmFunction = (alarmState: AlarmState, cb: () => void) => void; // 알림 데이터를 추가하는 이벤트 리스너
