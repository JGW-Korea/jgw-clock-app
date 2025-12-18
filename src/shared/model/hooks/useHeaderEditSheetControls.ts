import { useReducer } from "react";
import { patchState } from "../../utils";

export type EditMode = { 
  click: boolean;
  swipe: boolean;
}

// Reducer 내부에서 활용할 Action 객체 타입
export type HeaderControlReducerAction =
  | { type: "SET_SHEET_VISIBLE", payload: { key: "sheetOpen", value: boolean } }
  | { type: "SET_EDIT_MODE", payload: { key: "editMode", type?: keyof EditMode, value: EditMode } };

// Alarm Route 자체에서 관리해야 하는 상태 정보
export interface HeaderControlState {
  sheetOpen: boolean;
  editMode: EditMode;
}

// 현재 Control State 정보와 action을 전달받아 상태를 업데이트하는 Reducer 함수
function reducer(state: HeaderControlState, action: HeaderControlReducerAction): HeaderControlState {
  const { type, payload } = action;
  
  switch(type) {
    // Alarm Route 내부의 Bottom Sheet 활성화 여부 업데이트
    case "SET_SHEET_VISIBLE": {
      return patchState(state, payload.key, payload.value);
    }
    
    // Alarm Route 내부의 Alarm List의 Edit Mode 활성화 여부 업데이트
    case "SET_EDIT_MODE": {
      // Click or Swipe 방식을 통해 Edit 모드가 활성화되어 있는 경우 -> 비활성화를 한다.
      if(payload.value.click || payload.value.swipe) {
        return patchState(state, payload.key, { click: false, swipe: false });
      }

      // Edit 모드를 활성화 시킨 발생 원인(Click, Swipe)에 따라 상태를 변경한다.
      if(payload.type === "click") return patchState(state, payload.key, { click: true, swipe: false });
      else {
        return patchState(state, payload.key, { click: false, swipe: true });
      }
    }
  }
}

/**
 * Alarm Route에서 활용할 Bottom Sheet 컨트롤 커스텀 훅 
 *
 * @returns Alarm Bottom Sheet 제어 객체
 * @property {controls.controlState} - Header에서 관리할 수 있는 상태 정보(Bottom Sheet / Edit Mode)
 * @property {controls.handleOpenBottomSheet} - Header
 * @property {controls.handleCloseBottomSheet} - Alarm Bottom Sheet를 비활성화 시키는 메서드
*/
export default function useHeaderControls() {
  const [controlState, dispatch] = useReducer(reducer, { 
    sheetOpen: false,
    editMode: {
      click: false,
      swipe: false
    } 
  });

  return {
    controlState,
    handleOpenBottomSheet: () => dispatch({ type: "SET_SHEET_VISIBLE", payload: { key: "sheetOpen", value: true } }),
    handleCloseBottomSheet: () => dispatch({ type: "SET_SHEET_VISIBLE", payload: { key: "sheetOpen", value: false } }),
    handleEditModeActive: (type?: "click" | "swipe") => dispatch({ type: "SET_EDIT_MODE", payload: { key: "editMode", type, value: controlState.editMode } }),
  }
}
