import { useEffect, useState } from "react";
import { WorldHeader } from "../widgets/headers";
import { WorldContent } from "../widgets/world";

export default function World() {
  const [worldTimeList, setWorldTimeList] = useState<object[]>([]);
  
  useEffect(() => {
    const list = localStorage.getItem("worldTime");
    if(list) {
      setWorldTimeList(JSON.parse(list));
    }
  }, []);

  return (
    <>
      <WorldHeader />
      
      {/* 사용자가 추가한 세계 시간 리스트를 출력한다. */}
      <WorldContent
        list={worldTimeList}
      />
    </>
  );
}
