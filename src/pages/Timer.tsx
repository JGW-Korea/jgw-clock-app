import { useEffect, useState } from "react";
import { TimerHeader } from "../widgets/headers";

export default function Timer() {
  const [timerList, setTimerList] = useState<object[]>([]);
    
  useEffect(() => {
    const list = localStorage.getItem("worldTime");
    if(list) {
      setTimerList(JSON.parse(list));
    }
  }, []);

  return (
    <TimerHeader timerList={timerList} />
  );
}
