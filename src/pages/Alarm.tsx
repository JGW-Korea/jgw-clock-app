import { useEffect, useState } from "react";
import { AlarmHeader } from "../widgets/headers";
import AlarmContent from "../widgets/alarm/components/AlarmContent";

export default function Alarm() {
  const [alarmList, setAlarmList] = useState<object[]>([]);
    
  useEffect(() => {
    const list = localStorage.getItem("alarm");
    if(list) {
      setAlarmList(JSON.parse(list));
    }
  }, []);
  
  return (
    <>
      <AlarmHeader alarmList={alarmList} />

      <AlarmContent
        alarmList={alarmList}
      />
    </>
  );
}
