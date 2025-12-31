import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.scss";
import { BottomSheet } from "@shared/ui";
import WorldSheetListItem from "./WorldBottomSheetListItem";
import type { TimeZoneListDataType, TimeZoneListType } from "../types/timeZone";
import type { WorldAppendHandler } from "../model";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClickAppendWorld: WorldAppendHandler;
}

export default function WorldBottomSheet({ isOpen, onClose, onClickAppendWorld }: Props) {
  const [worldTimeListData, setWorldTimeListData] = useState<TimeZoneListDataType[]>([]);
    
  useEffect(() => {
    const fetchTimeZoneDbList = async () => {
      try {
        const { data: {
          status,
          message,
          zones
        } } = await axios.get(`https://api.timezonedb.com/v2.1/list-time-zone?key=${import.meta.env.VITE_TIME_ZONE_API}&format=json`) as TimeZoneListType;
        
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
    <BottomSheet isOpen={isOpen} onClose={onClose} sheetTitle="Choose a City">
      <ul className={`${styles["world-sheet-content"]}`}>
        {worldTimeListData.map(({ countryName, zoneName }) => {
          return (
            <WorldSheetListItem
              key={zoneName}
              countryName={countryName}
              zoneName={zoneName}
              onClickAppendWorld={onClickAppendWorld}
            />
          );
        })}
      </ul>
    </BottomSheet>
  )
}