import { ClockContext } from "../../../shared/context";
import { useAlarmList } from "../model";

interface Props {
  children: React.ReactElement;
}

export default function ClockProvider({ children }: Props) {
  const { alarmList, handleAddAlarm, handleDeleteAlarm } = useAlarmList();
  
  return (
    <ClockContext value={{ alarmList, handleAddAlarm, handleDeleteAlarm }}>
      {children}
    </ClockContext>
  );
}
