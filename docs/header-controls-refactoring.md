![header controls refactoring](./images/header-controls-refactoring.png)

> ☝️ 이 문서는 기존에 useHeaderControls 하나로 관리하던 Bottom Sheet 활성화 상태와 List Edit 제어 상태를, FSD 아키텍처에 맞게 각 기능 단위로 분리하여 리팩토링한 과정을 설명한 문서입니다.

<br />

## I. 기존 useHeaderControls 커스텀 훅 로직

Alarm, World 라우트에는 Bottom Sheet를 활성화하는 기능과, 화면에 표시되는 리스트 아이템을 Edit 모드로 전환하여 제거할 수 있는 기능이 존재합니다. 초기 구현 단계에서는 두 라우트가 서로 다른 맥락을 가질 수 있다고 판단하여, 각 라우트의 Pages 레이어에 model 세그먼트를 두고 별도의 상태 관리 로직을 구현했습니다.

그러나 프로젝트 개발이 완료된 이후 코드를 다시 검토해 보니, 두 라우트에서 사용하는 상태 구조와 로직이 사실상 동일하다는 점을 확인하게 되었습니다. 이에 따라 중복된 로직을 통합하기 위해 useHeaderControls라는 커스텀 훅을 새로 만들고, 기존에 Pages 레이어에 분산되어 있던 로직을 하나의 커스텀 훅으로 합쳐 관리하도록 수정했습니다.

이 과정에서 해당 훅이 어느 레이어에 속해야 하는지에 대한 고민을 했습니다. 기존 Pages 레이어에 위치해 있던 로직을 하나의 공통 훅으로 추출했기 때문에, 이 로직이 어떤 책임과 의미를 가지는지가 불명확해졌기 때문입니다.

FSD 아키텍처는 app -> pages -> widgets -> features -> entities -> shared의 계층 구조를 가지는데, 체음에는 features 레이어에 배치하는 것을 고려했습니다. 그러나 AlarmHeader와 WorldHeader가 각각 widgets 레이어에 존재하고, 이 훅은 특정 UI를 직접 제공하지 않은 채 model 로직만 포함하고 있었기 때문에 features에 두는 것이 구조적으로 어색하다고 판단했습니다. 결국 "두 페이지에서 공통으로 사용하는 로직"이라는 이유만으로 `shared/model/hooks` 경로로 이동시켜 관리하게 되었습니다.

```tsx
import { patchState } from "@shared/utils";
import { useReducer } from "react";

export type EditMode = { 
  click: boolean;
  swipe: boolean;
}

// Reducer Action 객체 타입
export type HeaderControlReducerAction =
  | { type: "SET_SHEET_VISIBLE", payload: { key: "sheetOpen", value: boolean } }
  | { type: "SET_EDIT_MODE", payload: { key: "editMode", type?: keyof EditMode, value: EditMode } };

// Header Control 상태
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
 * Header의 Edit / Bottom Sheet 활성화 등을 관리하는 커스텀 훅
 *
 * @returns Header에서 제공하는 기능을 관리할 수 있는 제어 객체 반환
 * @property {controls.controlState} - Header에서 관리할 수 있는 상태 정보(Bottom Sheet / Edit Mode)
 * @property {controls.handleOpenBottomSheet} - Header의 Bottom Sheet를 활성화 시키는 메서드
 * @property {controls.handleCloseBottomSheet} - Header의 Bottom Sheet를 비활성화 시키는 메서드
 * @property {controls.handleEditModeActive} - Header의 Edit 버튼을 누르거나, Swipe를 통해 Edit 모드를 활성화 / 비활성화 시키는 메서드
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
```