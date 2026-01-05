![problem](/public/images/problem.webp)

> ☝️ 이 문서는 FSD 아키텍처를 도입하는 과정에서 개인적으로 경험한 문제점과, 이를 어떻게 해결했는지를 정리한 문서입니다.

<br />

## I. FSD 아키텍처 구조에 대한 잘못된 이해로 인해 발생한 문제점

처음 FSD 아키텍처 구조를 접한 이후, Clock 프로젝트를 진행하던 당시에는 ["(번역) 기능 분할 설계 - 최고의 프론트엔드 아키텍처"](https://emewjin.github.io/feature-sliced-design/) 포스트를 참고하며 프로젝트를 진행했습니다. 다만, 해당 내용을 충분히 숙지한 상태에서 프로젝트를 진행하지 않았고, 해당 포스트가 공식 문서가 아닌 해외 개발 글을 번역한 자료였기 떄문에 일부 공식 문서의 내용이 누락되어 있었습니다. 이로 인해, 다음과 같은 문제점을 경험했습니다.

<br />

**① 각 레이어의 역할을 정확히 이해하지 못한 상태에서 구조를 설계한 문제**

FSD 아키텍처에서는 Process 레이어가 더 이상 권장하지 않기 때문에, 일반적으로 총 6개의 레이어로 구성됩니다.

|종류|설명|
|--|--|
|App|Routing, Entrypoint, Global Styles, Provider 등 앱을 실행하는 모든 요소|
|Pages|Route 기준으로 구성된 주요 화면 단위|
|Widgets|크고 독립적으로 동작하는 UI 구성 단위, 일반적으로 하나의 완결된 화면 기능(use case)을 제공합니다.|
|Features|사용자에게 비즈니스 가치를 제공하는 액션을 구현한 재사용 가능한 제품 기능 단위|
|Entities|프로젝트가 다루는 비즈니스 Entity|
|Shared|모든 Layer에서 재사용되는 코드(라이브러리, 유틸리티 등)|

> 위 테이블의 내용은 [FSD 아키텍처 공식 문서 개요](https://feature-sliced.design/kr/docs/get-started/overview#layers)에 작성된 내용을 그대로 가지고 온 것입니다.

각 레이어는 위와 같이 명확한 규칙과 역할을 기반으로 정의되어 있습니다. 그리고 블로그 포스트를 살펴보면, 다음과 같은 이미지가 있습니다.

![fSD-hierarchical](/public/images/fsd-hierarchical.png);

당시에는 앞서 설명한 FSD 아키텍처의 레이어별 의미와 작성 규칙을 충분히 숙지하지 않은 상태에서 프로젝트를 진행했기 때문에, 이 이미지만 보고 디렉토리 구조를 해석하게 되었습니다. 그 결과, App 레이어를 제외한 나머지 레이어를 단순히 **Atomic Deisgn System과 유사한 계층적 컴포넌트 구조**로 설계하면 된단고 판단했고, 아래와 같은 디렉토리 구조로 프로젝트를 구성하게 되었습니다.

```md
src/
├─ app/
├─ pages/
├─ widgets/
│  ├─ headers/
│  ├─ contents/
│  │  └─ ui/
│  │     └─ AlarmContent/
│  │        └─ AlarmContentListItem/
│  ├─ bottom-sheet/
│  └─ ...
├─ features/
│  ├─ time-picker/
│  └─ swipe-to-delete/
├─ entities/
│  ├─ list-item-container/
│  └─ ...
├─ shared/
│  ├─ list-item/
│  ├─ header/
│  ├─ bottom-sheet/
│  └─ ...
```

위 디렉토리 구조는 레이어의 형태 자체는 어느 정도 유지하고 있었지만, 각 레이어의 의미를 정확히 이해하지 못한 상태에서 설계를 진행했습니다. 그 결과 Entities 레이어는 도메인을 표현하기보다는, `widgets/contents/`에서만 사용되는 `ListItem`의 내부 컴포넌트들을 분리해 두는 용도로 사용되고 있었습니다.

이러한 점이 문제가 됬던 이유는 ToggleSwitch 컴포넌트는 사용자 인터랙션을 포함하고 있었기 때문에 처음에는 Features 레이어에 배치하여 개발을 진행했지만, 이후 Entities 레이어에서 해당 컴포넌트를 재사용하는 상황이 발생했습니다. 그 결과, entities -> features로의 레이어 참조 위반이 발생했습니다.

```tsx
// featues/toggle-switch
export default function ToggleSwitch({ id, active, onToggleActiveAlarm }: Props) {
  return (
    <div
      className={`${styles["switch"]} ${active ? styles["active"] : ""}`}
      onClick={() => onToggleActiveAlarm(id)}
    />
  )
}
```

```tsx
//entities/list-item-container/ui/AlarmListItemContainer
export default function AlarmListItemContainer() {
  return (
    <article>
      {/* ... */}
      
      {/* entities -> features 레이어 참조 위반 */}
      <div>
        <ToggleSwitch {/* props */} /> 
      </div>
    </article>
  )
}
```

이 문제를 해결하기 위해 FSD 아키텍처 공식 문서와 이전에 참고했던 블로그 포스트를 이미지 중심이 아니라 텍슽트 위주로 다시 읽어보았고, 그 과정에서 애초에 FSD 구조를 각 레이어의 의미에 기반해 설계한 것이 아니라, 이미지만 보고 Atomic Design System과 유사한 계층적 구조로 잘못 해석해 설계했다는 점을 알게 되었습니다. 이후 프로젝트의 기능 구현을 마무리한 뒤, 해당 내용을 바탕으로 다음과 같이 리팩토링을 진행했습니다.

```md
├─ app/
├─ pages/
├─ widgets/
│  ├─ contents/
│  │  └─ ui/
│  │     └─ AlarmContent/
│  │        └─ AlarmContentListItem/
│  └─ ...
├─ features/
│  ├─ toggle-switch/
│  └─ .../
├─ shared/
│  ├─ list-item/
│  └─ ...
```

```tsx
// shared/ui/ToggleSwitch
export default function ToggleSwitch({ id, active, onToggleActiveAlarm }: Props) {
  return (
    <div
      className={`${styles["switch"]} ${active ? styles["active"] : ""}`}
      onClick={() => onToggleActiveAlarm(id)}
    />
  )
}
```

```tsx
// widgets/contents/ui/AlarmContent/AlarmContentListItem
export default function AlarmContentListItem() {
  return (
    <SwitchToDelete>
      {/* 기존 widgets/list-item/ui에 작성한 ListItemContainer 구조 */}
      <article>
        {/* ... */}

        <div>
          <ToggleSwitch {/* props */} />
        </div>
      </article>
    </SwitchToDelete>
  )
}
```

위 코드와 같이 AlarmContentListItem의 내부 구조(기존 AlarmContentListItemContainer 컴포넌트)는 다른 곳에서 재사용되지 않았기 때문에, 별도의 컴포넌트로 분리하지 않고 AlarmContentListItem 컴포넌트의 내부 구조로 통합했습니다. 이를 통해 모든 컴포넌트를 무조건적으로 분리하는 방식이 아닌, 각 컴포넌트의 역활과 재사용 범위를 기준으로 구조를 구성함으로써 컴포넌트 간 불필요한 의존성을 줄였습니다.

또한, ToggleSwitch 컴포넌트를 AlarmContentListItem에서 직접 재사용하도록 리팩토링하면서, 기존에 발생했던 entities -> features 레이어 참조 규칙 위반을 widgets -> features 구조로 변경해 문제를 해결했습니다. 덧붙여, ToggleSwitch는 사용자 인터랙션을 통해 동작하긴 하지만 내부적으로 상태를 관리하지 않고 전달받은 Props를 통해 활성화･비활성화 여부만 결정하는 순수 UI 컴포넌트이기 때문에, features 레이어가 아닌 shared 레이어로 이동시켜 관리하도록 리팩토링했습니다.

<br />

**② 모든 레이어가 Slice -> Segment 구조를 가진다고 잘못 이해한 문제**

<br />

## II. 기존 코드 스타일과 FSD 규칙 사이의 간극

## III. FSD 레이어 원칙 적용 시 상태 소유권 분리에 대한 고민

- stopwatch를 제어하는 컴포넌트 설계를 featuers에다가 해야될 지 widgets에 해야될 지 모르는 상황
- 왜냐하면 featuers 레이어 자체는 사용자의 인터랙션을 통해 기능이 변경되는 로직이 있고, widgets에는 상태를 정의하는 로직이 있기 때문에
- 하지만, FSD 아키텍처의 레이어 자체의 원칙대로 컴포넌트 구조를 설계할 경우 다음과 같은 문제가 발생했음
  - 불필요한 정도로 코드가 분리됨
  - 상태 정의는 widgets에서 되고 있고, 상태 업데이트(setState) 함수는 넘겨줘야 하는 구조가 발생함
  - 그렇다고 상태도 featuers에서 할 경우에는 Props는 단방향(부모 -> 자식) 구조이기 떄문에 이를 역방향으로 하기 위해서는 전역 상태를 이용해야 됨
  - 또한, 로직을 widgets에서 정의하고 featuers에 넘기는 구조가 되면 featuers에는 컴포넌트 로직만 있기 때문에 featuers 레이어 역할에 충실하지 못하게 됨
- 위 같은 문제로 인해서 상태를 선언한 widgets에서 상태를 제어하는 로직까지 가지게 만들어서 상태 소유권과 제어 책임을 분리시키지 않는 구조로 진행함