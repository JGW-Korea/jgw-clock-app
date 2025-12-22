import { AlarmContext, useAlarmList } from "../model";

/**
 * Alarm 도메인 데이터를 전역에서 공유하기 위한 Provider 컴포넌트
*/
export default function AlarmProvider({ children }: { children: React.ReactElement | React.ReactElement[] }) {
  const { alarmList, handleAddAlarm, handleDeleteAlarm, handleToggleActiveAlarm } = useAlarmList();
  
  return (
    <AlarmContext value={{ alarmList, handleAddAlarm, handleDeleteAlarm, handleToggleActiveAlarm }}>
      {children}
    </AlarmContext>
  );
}
