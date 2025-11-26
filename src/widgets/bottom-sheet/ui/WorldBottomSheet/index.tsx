import { useEffect, useState } from "react";
import axios from "axios";
import BottomSheet, { type Props } from "../../../../shared/bottom-sheet";
import type { TimeZoneListDataType, TimeZoneListType } from "../types/timeZone";
import WorldTimeListItem from "./components/WorldTimeListItem";

export default function WorldBottomSheet({ show, onClick, onAppendTimeList }: Omit<Props, "children"> & { onAppendTimeList: (name: string, to: string) => void; }) {
  const [worldTimeListData, setWorldTimeListData] = useState<TimeZoneListDataType[]>([]);

  useEffect(() => {
    const fetchTimeZoneDbList = async () => {
      try {
        const { data: {
          status,
          message,
          zones
        } } = await axios.get(`http://api.timezonedb.com/v2.1/list-time-zone?key=${import.meta.env.VITE_TIME_ZONE_API}&format=json`) as TimeZoneListType;
        
        if(status === "FAILED") {
          throw new Error(message);
        }

        setWorldTimeListData(zones);
      } catch(error) {
        console.error(error);
      }
    }

    fetchTimeZoneDbList();
  }, []);
  
  return (
    <BottomSheet show={show} onClick={onClick}>
      <ul>
        {worldTimeListData.map(({ countryName, zoneName }) => {
          return (
            <WorldTimeListItem
              key={zoneName}
              countryName={countryName}
              zoneName={zoneName}
              onAppendTimeList={onAppendTimeList}
            />
          );
        })}
      </ul>
    </BottomSheet>
  );
}
