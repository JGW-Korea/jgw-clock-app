import { useEffect, useState } from "react";
import { WorldHeader } from "../widgets/headers";
import { WorldContent } from "../widgets/world";
import WorldBottomSheet from "../widgets/bottom-sheet/ui/WorldBottomSheet";
import axios from "axios";
import type { ConvertTimeZoneType } from "../widgets/bottom-sheet/ui/types/timeZone";

type WordTimeListType = {
  name: string;
  from: string;
  to: string;
  offset: number;
}

export default function World() {
  const [worldTimeList, setWorldTimeList] = useState<WordTimeListType[]>([]);
  const [worldTimeBottomSheetOpen, setWorldTimeBottomSheetOpen] = useState<boolean>(false);
  
  useEffect(() => {
    const list = localStorage.getItem("worldTime");
    if(list) {
      setWorldTimeList(JSON.parse(list));
    }
  }, []);

  // 세계 시계 추가 이벤트 리스너 
  const onAppendWorldTimeListener = async (selectName: string, to: string) => {
    const { data } = await axios.get(`http://api.timezonedb.com/v2.1/convert-time-zone?key=${import.meta.env.VITE_TIME_ZONE_API}&format=json&from=${Intl.DateTimeFormat().resolvedOptions().timeZone}&to=${to}`) as ConvertTimeZoneType;
    
    const newData: WordTimeListType = {
      name: selectName,
      from: data.fromZoneName,
      to: data.toZoneName,
      offset: data.offset
    }

    // 사용자가 등록한 세계 시계 리스트 정보를 포함하고 있는 상태를 업데이트하여, UI를 갱신한다. (UI 갱신용)
    setWorldTimeList((current) => {
      if(!current.length) { // 아무런 정보를 포함하고 있지 않는 경우
        localStorage.setItem("worldTime", JSON.stringify([newData]));
        return [newData];
      }

      // 하나 이상의 정보를 포함하고 있는 경우 -> 중복된 데이터는 추가하면 안되기 때문에 별도의 검증을 하여 추가한다.
      for(let prevData of current) {
        if(prevData.to === to) {
          return [
            ...current
          ];
        }
      }

      // 정보를 포함하고 있으면서, 중복된 나라가 없는 경우 이전 정보와 새로운 정보를 결합한 상태를 반환한다.
      localStorage.setItem("worldTime", JSON.stringify([...current, newData]));
      return [
        ...current,
        newData
      ];
    });

    setWorldTimeBottomSheetOpen(false);
  }

  return (
    <>
      <WorldHeader worldTimeList={worldTimeList} onClick={() => setWorldTimeBottomSheetOpen(true)}/>
      
      {/* 사용자가 추가한 세계 시간 리스트를 출력한다. */}
      <WorldContent
        worldTimeList={worldTimeList}
      />

      <WorldBottomSheet
        show={worldTimeBottomSheetOpen}
        onClick={() => setWorldTimeBottomSheetOpen(false)}
        onAppendTimeList={onAppendWorldTimeListener}
      />
    </>
  );
}
