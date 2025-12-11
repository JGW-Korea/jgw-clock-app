import { ClockContext } from "../../../shared/context";
import { useAlarmList } from "../model";

interface Props {
  children: React.ReactElement;
}

export default function ClockProvider({ children }: Props) {
  const { alarmList, handleAddAlarm } = useAlarmList();
  
  return (
    <ClockContext value={{ alarmList, handleAddAlarm }}>
      {children}
    </ClockContext>
  );
}
