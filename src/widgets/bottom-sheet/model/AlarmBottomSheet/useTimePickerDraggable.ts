import { useState } from "react";

/** 
 * Alarm Bottom Sheet의 드래그 여부를 결정짓는 커스텀 훅
*/
export function useTimePickerDraggable() {
  


  
  
  const [timePickerDraggable, setTimePickerDraggable] = useState<boolean>(false);

  return {
    timePickerDraggable,
    handleTimePickerMouseOver() {
      setTimePickerDraggable(true);
    },
    handleTimePickerMouseLeave() {
      setTimePickerDraggable(false);
    }
  }
}