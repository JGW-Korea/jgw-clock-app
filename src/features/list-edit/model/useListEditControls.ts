import { useState } from "react";

type EditMode = {
  click: boolean;
  swipe: boolean;
}

const initalState: EditMode = {
  click: false,
  swipe: false,
}

/**
 * Edit Mode를 제어하는 커스텀 훅
*/
export default function useListEditControls() {
  const [editMode, setEditMode] = useState<EditMode>(initalState);

  const handleEditModeActive = (type: keyof EditMode) => {
    // Click or Swipe 방식을 통해 Edit 모드가 활성화되어 있는 경우 -> 비활성화를 한다.
    if(editMode.click || editMode.swipe) {
      setEditMode(initalState);
      return;
    }

    // Edit 모드를 활성화 시킨 발생 원인(Click, Swipe)에 따라 상태를 변경한다.
    setEditMode((prev) => ({
      ...prev,
      [type]: !prev[type]
    }));
  }

  return {
    editMode,
    handleEditModeActive
  }
}
