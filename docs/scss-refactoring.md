![sass refactoring](./images/sass-refactoring.png)

> ☝️ 이 문서는 프로젝트 개발 완료 이후, 기존 SCSS 스타일시트 코드를 분석하고 이를 기반으로 리팩토링을 진행한 과정을 단계적으로 정리한 문서입니다.

<br />

## I. SCSS 스타일 코드를 리팩토링을 하게 된 이유

```md
src/
├── widgets/
│   ├── navigator/
│   │   ├── ui/
│   │   │   ├── TabItem/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.styles.scss
│   │   │   │   ├── mixin.scss
│   │   │   │   └── variable.scss
│   │   │   ├── index.tsx
│   │   │   └── index.styles.scss
│   │   └── ...
│   │
│   └── headers/
│       ├── AlarmHeader/
│       │   ├── ui/
│       │   │   ├── index.tsx
│       │   │   ├── _index.module.scss
│       │   │   ├── _mixin.scss
│       │   │   └── _variable.scss
│       │   └── ...
│       │
│       ├── WorldHeader/
│       │   ├── ui/
│       │   │   ├── index.tsx
│       │   │   ├── _index.module.scss
│       │   │   ├── _mixin.scss
│       │   │   └── _variable.scss
│       │   └── ...
│       └── ...
│
└── ...
```

현재 디렉토리 구조를 보면 알 수 있듯이, 어떤 부분에서는 파일 식별자 이름이 `styles`로 시작하고, 어떤 부분은 `module`로 시작하고 있습니다.

또한 지금 구조는 Liquid-Glass 스타일을 사용하고 있는 컴포넌트들만 몇 개만 요약해서 보여주고 있는데, 여기서 사용되고 있는 `mixin.scss`, `variable.scss`는 모두 동일한 역할을 하고 있음에도 불구하고 여러 개의 파일로 나뉘고 있습니다.

그리고 `TabItem`의 `mixin`과 `variable`은 컴파일(정확히는 SCSS -> CSS 트랜스파일)에 포함시키지 않아도 되는 대상임에도 불구하고, 현재 언더바(_) 기호를 쓰지 않고 있기 때문에 컴파일 대상이 되고 있습니다.

<br />

```scss
// 특정 hover 동적 가상 클래스 스타일 로직
.css-class-name {
  &:hover {
    &.glass-button__text {
      color: #ff7f00;
    }
    &.glass-button__icon {
      & > svg {
        & > path {
          stroke: #ff7f00;
        }
      }
    }
  }
}
```

또한 위 코드를 보면 알 수 있듯이, 텍스트 색상과 아이콘 색상을 동일하게 유지해야 함에도 불구하고 동일한 HEX 색상 값이 각각 개별적으로 선언되어 있습니다. 해당 색상 값은 여러 곳에서 공통으로 사용되는 값이기 때문에, 하나의 기준으로 관리되며 일관되게 적용되어야 합니다.

그러나 현재 구조에서는 색상을 변경해야 할 경우, 해당 HEX 값을 사용한 모든 위치를 직접 찾아 수정해야 하는 문제가 발생합니다. 또한 Visual Studio Codeㅘ 같은 IDE의 검색･치환 기능을 이용해 일관 변경을 시도할 셩우, 의도하지 않은 다른 영역의 동일한 값까지 함께 변경될 위험이 있어 안정적인 유지보수가 어렵다는 문제가 있습니다.

<br />

지금까지 살펴본 여러 문제점들을 통해, 프로젝트를 개발하던 당시부터 SCSS의 장점을 충분히 활용하지 못했고 스타일 구조 또한 개선의 여지가 크다고 판단했습니다. 이로 인해 프로젝트 개발이 완료된 이후 아쉬운 점들을 정리하고 구조적인 일관성과 유지보수성을 높이기 위해 SCSS 스타일 코드 전반에 대한 리팩토링을 진행하기로 결정했습니다.

<br />

## II. 컴파일 대상에 포함시키지 않는 전역 스타일 토큰 정의

프로젝트 개발이 완료된 이후, 가장 먼저 진행한 리팩토링 작업은 프로젝트 전반에서 반복적으로 사용되고 있는 SCSS 스타일 코드의 색상 값 등을 한 곳으로 정리하는 것이었습니다. 이를 통해 각 스타일 값이 어떤 용도로 사용되고 있는지, 그리고 여러 컴포넌트 중 어디에서 활용되고 있는지를 다음과 같이 명확하게 파악했습니다.

```scss
// src/app/layout -> background-color 값으로 사용
// src/app/styles -> background-color 값으로 사용
// src/features/swipe-to-delete -> button.box-shadow 값으로 사용
#000

// 전역 폰트 color 값으로 사용
// picker mask 2번째 인자 값으로 사용
// picker-track, picker-track-holder color 값으로 사용
// bottom sheet header color 값으로 사용
// List Item color 값으로 사용
// TimerContent button의 color 값으로 사용
// TimerContent button.decrement::before / button.increment::before의 border 값으로 사용
#FFF

// swipe-to-delete__actions > button background-color 값으로 사용
// AlarmContent delete-btn background-color 값으로 사용
// Stopwatch button-group > .stop color 값으로 사용
// TimerContent button-group > .stop color 값으로 사용
// WorldContentListItem delete-btn background-color 값으로 사용
#df3b32

...
```

> _현재 SCSS 코드 블럭은 사용 중인 색상 값의 활용 용도를 일부 요약한 내용입니다. 전체 내용은 이전 변경(commit) 이력인 [`refactor: CSS 스타일 변수 파일 생성`](https://github.com/JGW-Korea/jgw-clock-app/commit/27830462eb4d9b8c86aae1262fd82b0ab77e9deb#diff-3ad4e18cf72ade15855069362d55f48af9cd4c47dd7d042a4856510ec0e558ee)에서 확인할 수 있습니다._