import { useRef } from "react";

// 
export default function useTimePickerAnimation() {
  const meridiemRef = useRef<HTMLUListElement>(null);
  const hoursRef = useRef<HTMLUListElement>(null);
  const minutesRef = useRef<HTMLUListElement>(null);


  return { meridiemRef, hoursRef, minutesRef };
}


// import { HOURS_LIST, HOURS_WHEEL, HOURS_TRACK, MERIDIEM_ITEMS, MINUTES_LIST, MINUTES_TRACK, MINUTES_WHEEL } from "../consts";