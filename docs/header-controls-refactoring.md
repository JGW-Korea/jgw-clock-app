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

<br />

## II. 리팩토링한 useHeaderControls 로직이 FSD 아키텍처에 적합한지에 대한 고민

기존 로직을 통합하여 useHeaderControls로 리팩토링한 이후에도, 현재 구조가 과연 FSD 아키텍처의 의도에 부합하는지에 대한 의문이 계속 남아 있었습니다. FSD 아키텍처는 Layer, Slice, Segment를 통해 관심사를 명확히 분리하고 각 요소가 단일 책임을 갖도록 설계하는 것을 목표로 합니다. 그러나 현재 구조는 "헤더를 제어한다"는 포괄적인 관심사를 기준으로 로직이 묶여 있으며, 이 로직을 shared/model에 두는 것이 적절한지가 의문이였습니다.

shared 레이어는 애플리케이션 전역에서 재사용 가능하거나, 특정 도메인이나 화면에 종속되지 않는 관심사를 배치하기 위한 공간입니다. 하지만 useHeaderControls는 "헤더를 제어한다"는 성격을 가지며, 이는 모든 페이지에서 공통으로 사용되는 전역 개념이 아니라 Alarm과 World처럼 특정 페이지에서만 의미를 갖는 기능 집합이기 때문입니다. 이로 인해, shared에 배치하는 것은 레이어의 책임과 맞지 않는다고 판단했습니다.

또한 저를 더 고민하게 된 이유는 "헤더를 제어한다"는 단일 책임 자체가 아니라는 점이였습니다. 헤더는 편집 모드, Bottom Sheet 호출 등 서로 다른 목적을 가진 여러 기능이 공존합니다. 이 기능들을 각각의 관심사 집합으로 놓고 보면, 이들의 교집합에 위치한 요소가 헤더일 뿐이기 때문입니다. 즉, "헤더 제어"라는 기준은 실제로는 서로 독립적인 기능들의 교집합을 묶어 하나의 책임처럼 취급한 것이며, 이로 인해 서로 다른 상태와 로직이 불필요하게 결합된 구조가 만들어 지는 것이기 때문에 FSD가 추구하는 관심사 분리와 단일 책임 원칙에 부합하지 않는다고 판단했습니다.

이러한 이유들로, 저는 관심사를 다시 명확히 분리하기 위해 다음과 같이 리팩토링을 진행했습니다.

<br />

**① 헤더를 제어하는 기능들을 별도의 책임으로 분리**

헤더를 제어하기 위한 상태는 다음과 같이 구성이 되어있었습니다.

```tsx
// 기존 useHeaderControls 내부에서 관리되고 있는 상태 구조
const [controlState, dispatch] = useReducer(reducer, { 
  sheetOpen: false,
  editMode: {
    click: false,
    swipe: false
  } 
});
```

코드를 보면 알 수 있듯이 Bottom Sheet의 활성화 여부를 제어하는 `sheetOpen: boolean` 상태와 버튼 또는 스와이프를 통해 편집 모드가 활성화되는 `editMode: { click: boolean, swipe: boolean }` 상태가 하나의 객체로 묶여 함께 관리되고 있습니다.

이로 인해 Bottom Sheet의 활성화 여부를 제어하는 useBottomSheetControls와, 버튼 또는 스와이프를 통해 편집 모드를 제어하는 useListEditControls로 로직을 분리하여, 각 커스텀 훅이 하나의 책임만 관리하도록 기존에 묶여 있던 상태를 기능 단위로 분리했습니다.

```tsx
// Bottom Sheet 활성화 여부만 제어하는 useBottomSheetControls
export default function useBottomSheetControls() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // ...
}
```

```tsx
// 버튼 또는 스와이프를 통해 편집 모드 활성화 여부만 제어하는 useListEditControls
export default function useListEditControls() {
  const [editMode, setEditMode] = useState<EditMode>({
    click: false,
    swipe: false
  });

  // ...
}
```

이처럼 "헤더 제어"라는 기능을 서로 다른 책임으로 분리함으로써, A의 로직이 변경되더라도 B에 영향을 주지 않고, B의 로직이 변경되더라도 A에 영향을 주지 않는 구조로 개선되었습니다. 그 결과, 결합도는 낮아지고 응집도는 높은 구조로 전환되었습니다.

<br />

**② 분리된 책임을 어느 레이어에 속할 것인지에 대한 고민**

"헤더 제어"라는 기능을 서로 다른 책임으로 분리한 이후, 이 훅 파일들을 어느 레이어에 배치해야 할지에 대해 다시 고민하게 되었습니다.

고민을 한 이유는, 분리된 로직들이 모두 사용자 인터랙션을 통해 헤더의 동작을 제어하기 때문입니다. AlarmHeader와 WorldHeader는 페이지 내에서 독립적인 위젯이지만, 이들이 제어하는 상태는 Bottom Sheet나 콘텐츠 영역 등 페이지의 다른 독립적인 컴포넌트에도 영향을 미칩니다. 따라서 헤더 내부에서 상태를 소유하는 방식은 Header -> Page -> Bottom Sheet / Contents 방향으로 Props를 전달하는 구조를 표현할 수 없었습니다.

결과적으로 상태의 소유권은 Page에 있어야 했고, Page가 분리된 훅 로직을 조합하여 Header, Content, Bottom Sheet에 필요한 상태를 Props로 전달하는 구조가 필요했습니다. 그러나 이렇게 Page에서 조합해서 사용해야 하는 로직을 features 레이어에 model 세그먼트만 두는 형태로 배치하는 것도, 앞서 ["I. 기존 useHeaderControls 커스텀 훅 로직"](#i-기존-useheadercontrols-커스텀-훅-로직)의 마지막 단락에서 설명한 것처럼 구조적으로 어색하다고 판단했습니다. 이로 인해 해당 로직을 어느 레이어에 두는 것이 적절한지에 대해 계속해서 고민하게 되었습니다.

그래서 개인적으로 계속 고민하기보다는, FSD 공식 문서에 제공된 실제 예제를 참고하여 레이어 배치를 결정하기로 했습니다. 그 과정에서 ["Moke Smoke"](https://github.com/penteleichuk/Moke-Smoke/tree/main/src) 프로젝트의 `src/features/auth/change-password` 디렉토리 구조가 다음과 같이 구성되어 있는것을 확인했습니다.

```md
# FSD 공식 문서 Moke Smoke 프로젝트 src/features/auth/change-password 구조
src/
└─ features/
   └─ auth/
      ├─ change-password/
      │  ├─ model/
      │  │  ├─ hooks/
      │  │  └─ validations/
      │  │
      │  └─ index.ts
      │
      └─ ...
```

예제 Moke Smoke 프로젝트의 구조를 보면 알 수 있듯이, change-password 슬라이스에는 model 세그먼트만 존재하고 별도의 ui 세그먼트는 포함되어 있지 않습니다. 이 예제를 통해, 하나의 Slice가 반드시 화면을 구성하는 컴포넌트를 가져야 하는 것은 아니라는 점을 확인할 수 있었습니다.

프로젝트를 진행하면서 저는 프론트엔드 개발이라는 맥락에서 디렉토리 구조를 해석하다 보니, 모든 Slice에는 이를 뒷받침하는 ui 컴포넌트가 반드시 함께 존재해야 한다는 전제를 가지고 구조를 판단하고 있었습니다. 이로 인해, useHeaderControls와 같이 ui를 직접 제공하지 않는 로직을 features에 배치하는 것이 어색하다고 느끼고, 결과적으로 레이어 선택에 혼란이 생기게 되는것이었습니다.

하지만 FSD 아키텍처는 Layer, Slice, Segment 단위로 관심사를 분리하여 각 요소가 단일 책임을 갖도록 만들고, 이를 통해 결합도를 낮추고 응집도를 높이기 위한 구조 설계 방식입니다. 이는 모든 Slice가 반드시 ui를 포함해야 한다와 같은 강제성을 의미하지 않습니다. 이 점을 인식하게 되면서, 사용자 인터랙션을 통해 헤더의 동작을 제어하는 로직 역시 하나의 독립적인 기능으로서 features 레이어에 위치시키는 것이 적절하다는 판단에 도달할 수 있었고, 그로 인해 레이어 배치에 대한 고민을 해결할 수 있었습니다.

```md
# FSD 아키텍처 방법론에 맞게 수정한 디렉토리 구조
src/
└─ features/
   ├─ bottom-sheet/
   │  ├─ model/
   │  │  ├─ useBottomSheetControls.ts
   │  │  └─ index.ts
   │  │
   │  └─ index.ts
   │
   └─ list-edit/
      ├─ model/
      │  ├─ useListEditControls.ts
      │  └─ index.ts
      │
      └─ index.ts
```