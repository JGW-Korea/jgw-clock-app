import { useEffect, useState } from "react";
import type { WordTimeListType } from "./index.type";
import type { WorldAppendHandler } from "@widgets/bottom-sheet";
import type { EditMode } from "@features/list-edit";

export default function useWorldTimeList(handleCloseBottomSheet: () => void, handleEditModeActive:(type: keyof EditMode) => void) {
  const [worldTimeList, setWorldTimeList] = useState<WordTimeListType[]>([]);

  // World Route가 마운트 될 시 실행될 Side-effect 로직
  useEffect(() => {
    const list = localStorage.getItem("worldTime");
    if(list) {
      setWorldTimeList(JSON.parse(list));
    }
  }, []);

  // 세계 시계 추가 이벤트 리스너 
  const handleAppendWorldTime: WorldAppendHandler = async (targetCity, targetTimeZone) => {
    const now = new Date(); // 기준이 될 현재 시간을 구한다.
    
    const fromDate = new Date(now.toLocaleString("en-US")).getTime(); // timeZone 옵션을 지정을 안하면 자동으로 사용자 지역대로 시간을 계산한다.
    const toDate = new Date(now.toLocaleString("en-US", { timeZone: targetTimeZone })).getTime();

    const newData: WordTimeListType = {
      from: Intl.DateTimeFormat().resolvedOptions().timeZone,     // 사용자 도시
      name: targetCity,                                           // 선택한 도시의 전체 이름
      to: targetTimeZone,                                         // 선택한 도시의 Time Zone 이름
      offset: Math.round((toDate - fromDate) / (1000 * 60 * 60))  // 두 도시 간 시차(시(hours) 단위)
    }

    // 사용자가 등록한 세계 시계 리스트 정보를 포함하고 있는 상태를 업데이트하여, UI를 갱신한다. (UI 갱신용)
    setWorldTimeList((current) => {
      if(!current.length) { // 아무런 정보를 포함하고 있지 않는 경우
        localStorage.setItem("worldTime", JSON.stringify([newData]));
        return [newData];
      }

      // 하나 이상의 정보를 포함하고 있는 경우 -> 중복된 데이터는 추가하면 안되기 때문에 별도의 검증을 하여 추가한다.
      for(let prevData of current) {
        if(prevData.to === targetTimeZone) {
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

    handleCloseBottomSheet(); // Bottom Sheet를 비활성화 시킨다.
  }

  const handleDelete = (id: number | string) => {
    const afterDelete = worldTimeList.filter(({ to }) => id !== to);

    if(afterDelete.length === 0) {
      handleEditModeActive("click");
    }

    localStorage.setItem("worldTime", JSON.stringify(afterDelete));
    setWorldTimeList(afterDelete);
  }

  return {
    worldTimeList,
    handleAppendWorldTime,
    handleDelete
  }
}