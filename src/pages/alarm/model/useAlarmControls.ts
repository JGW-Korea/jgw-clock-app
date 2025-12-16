import { useReducer } from "react";
import type { Action, ControlState } from "../types";
import { applyControlAction } from "../utils";

// 현재 Control State 정보와 action을 전달받아 상태를 업데이트하는 Reducer 함수
function reducer(state: ControlState, action: Action): ControlState {
  const { type, payload } = action;
  
  switch(type) {
    case "SHEET_SHOW_CHANGE": { // Alarm Route 내부의 Bottom Sheet 활성화 여부 업데이트
      return applyControlAction(state, payload.key, payload.value);
    }
    case "EDIT_ACTIVE": { // Alarm Route 내부의 Alarm List의 Edit Mode 활성화 여부 업데이트
      // Click or Swipe 방식을 통해 Edit 모드가 활성화되어 있는 경우 -> 비활성화를 한다.
      if(payload.value.click || payload.value.swipe) {
        return applyControlAction(state, payload.key, { click: false, swipe: false });
      }

      // Edit 모드를 활성화 시킨 발생 원인(Click, Swipe)에 따라 상태를 변경한다.
      if(payload.type === "click") return applyControlAction(state, payload.key, { click: true, swipe: false });
      else {
        return applyControlAction(state, payload.key, { click: false, swipe: true });
      }
    }
  }
}

/**
 * Alarm Route에서 활용할 Bottom Sheet 컨트롤 커스텀 훅 
 *
 * @returns Alarm Bottom Sheet 제어 객체
 * @property {controls.open} - Alarm Bottom Sheet 활성화 상태
 * @property {controls.handleOpenBottomSheet} - Alarm Bottom Sheet를 활성화 시키는 메서드
 * @property {controls.handleCloseBottomSheet} - Alarm Bottom Sheet를 비활성화 시키는 메서드
*/
export default function useAlarmControls() {
  const [controlState, dispatch] = useReducer(reducer, { 
    sheetOpen: false,
    editMode: {
      click: false,
      swipe: false
    } 
  });

  return {
    controlState,
    handleOpenBottomSheet: () => dispatch({ type: "SHEET_SHOW_CHANGE", payload: { key: "sheetOpen", value: true } }),
    handleCloseBottomSheet: () => dispatch({ type: "SHEET_SHOW_CHANGE", payload: { key: "sheetOpen", value: false } }),
    handleEditModeActive: (type?: "click" | "swipe") => dispatch({ type: "EDIT_ACTIVE", payload: { key: "editMode", type, value: controlState.editMode } }),
  }
}
