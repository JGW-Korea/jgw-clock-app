import { useState } from "react";

/** 
 * Alarm Bottom Sheet 내부 기능인 TimePicker에 드래그 발생 시 Bottom Sheet의 Drag와 중첩되지 않기 위해 Bottom Sheet의 드래그를 막는 커스텀 훅
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