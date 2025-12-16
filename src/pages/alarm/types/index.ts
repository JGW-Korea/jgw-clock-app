type EditMode = { 
  click: boolean;
  swipe: boolean;
}

// Reducer 내부에서 활용할 Action 객체 타입
export type Action =
  | { type: "SHEET_SHOW_CHANGE", payload: { key: "sheetOpen", value: boolean } }
  | { type: "EDIT_ACTIVE", payload: { key: "editMode", type?: keyof EditMode, value: EditMode } };

// Alarm Route 자체에서 관리해야 하는 상태 정보
export interface ControlState {
  sheetOpen: boolean;
  editMode: EditMode;
}