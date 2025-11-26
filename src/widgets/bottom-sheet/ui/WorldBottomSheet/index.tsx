import { useEffect, useState } from "react";
import axios from "axios";
import BottomSheet, { type Props } from "../../../../shared/bottom-sheet";
import type { TimeZoneListDataType, TimeZoneListType } from "../types/timeZone";
import WorldTimeListItem from "./components/WorldTimeListItem";

export default function WorldBottomSheet({ show, onClick }: Omit<Props, "children">) {
  const [worldTimeList, setWorldTimeList] = useState<TimeZoneListDataType[]>([]);

  useEffect(() => {
    const fetchTimeZoneDbList = async () => {
      try {
        const { data: {
          status,
          message,
          zones
        } } = await axios.get(`http://api.timezonedb.com/v2.1/list-time-zone?key=WIZL9AF2PJUK&format=json`) as TimeZoneListType;
        
        if(status === "FAILED") {
          throw new Error(message);
        }

        console.log(zones)
        setWorldTimeList(zones);
      } catch(error) {
        console.error(error);
      }
    }

    fetchTimeZoneDbList();
  }, []);
  
  return (
    <BottomSheet show={show} onClick={onClick}>
      <ul>
        {worldTimeList.map(({ countryName, zoneName }) => {
          return (
            <WorldTimeListItem
              key={zoneName}
              countryName={countryName}
              zoneName={zoneName}
            />
          );
        })}
      </ul>
    </BottomSheet>
  );
}
