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
      return applyControlAction(state, payload.key, payload.value);
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
    editMode: false 
  });
  
  return {
    controlState,
    handleOpenBottomSheet: () => dispatch({ type: "SHEET_SHOW_CHANGE", payload: { key: "sheetOpen", value: true } }),
    handleCloseBottomSheet: () => dispatch({ type: "SHEET_SHOW_CHANGE", payload: { key: "sheetOpen", value: false } }),
    handleEditModeActive: () => dispatch({ type: "EDIT_ACTIVE", payload: { key: "editMode", value: !controlState.editMode } })
  }
}
