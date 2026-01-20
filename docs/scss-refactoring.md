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
│   ├── headers/
│   │   ├── AlarmHeader/
│   │   │   ├── ui/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.module.scss
│   │   │   │   ├── _mixin.scss
│   │   │   │   └── _variable.scss
│   │   │   └── ...
│   │   │
│   │   ├── WorldHeader/
│   │   │   ├── ui/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.module.scss
│   │   │   │   ├── _mixin.scss
│   │   │   │   └── _variable.scss
│   │   │   └── ...
│   │   └── ...
│   │
│   └── ...
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

그러나 현재 구조에서는 색상을 변경해야 할 경우, 해당 HEX 값을 사용한 모든 위치를 직접 찾아 수정해야 하는 문제가 발생합니다. 또한 Visual Studio Code 같은 IDE의 검색･치환 기능을 이용해 일관 변경을 시도할 경우, 의도하지 않은 다른 영역의 동일한 값까지 함께 변경될 위험이 있어 안정적인 유지보수가 어렵다는 문제가 있습니다.

지금까지 살펴본 여러 문제점들을 통해, 프로젝트를 개발하던 당시부터 SCSS의 장점을 충분히 활용하지 못했고 스타일 구조 또한 개선의 여지가 크다고 판단했습니다. 이로 인해 프로젝트 개발이 완료된 이후 아쉬운 점들을 정리하고 구조적인 일관성과 유지보수성을 높이기 위해 SCSS 스타일 코드 전반에 대한 리팩토링을 진행하기로 결정했습니다.

<br />

## II. 컴파일 대상에 포함시키지 않는 전역 SCSS 스타일 토큰 정의

**① 전역 색상 토큰 정의**

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

<br />

이처럼 사용 중인 값들을 정리하여 각 값이 어떤 용도로 사용되고 있는지와 활용 범위가 어느 정도인지를 파악한 뒤, 이를 색상 토큰으로 정의했습니다.

```scss
$color-000000: #000000;
$color-ffffff: #ffffff;
$color-333333: #333333;
$color-2c2c2f: #2c2c2f;
$color-353535: #353535;
$color-414040: #414040;
$color-ff7f00: #ff7f00;
$color-df3b32: #df3b32;
$color-aca6a6: #aca6a6;
$color-9e9eb2: #9e9eb2;
$color-4d4d4d: #4d4d4d;
$color-1b3d27: #1b3d27;
$color-3d1616: #3d1616;
$color-2ed157: #2ed157;
$color-a8a8a8: #a8a8a8;
```

처음이는 이렇게 정의한 색상 토큰 변수를 모듈로 불러와 그대로 사용할 계획이었습니다. 그러나 해당 토큰들은 의미론적(Semantic) 맥락 없이 단순한 `color-HEX` 값으로만 구성되어 있어, 실제로 사용하더라도 각 값이 어떤 역할을 하는지 직관적으로 파악하기 어렵다고 판단했습니다.

또한 현재는 동일한 색상 값을 사용하고 있더라도, 추후 텍스트 색상은 유지한 채 테두리(border) 색상만 일부 수정해야 하는 상황이 발생할 수 있습니다. 이 경우 기존 구조에서는 새로운 변수를 추가로 선언해야 하므로, 확정성 측면에서 불리할 수 있다고 느꼈습니다.

이로 인해, 정의한 색상 토큰을 보다 의미론적으로 표현하고 확장성을 높이기 위해 SCSS의 `map` 자료형을 활용하여 색상 토큰을 구분해 관리하기로 했습니다.

```scss
$bg-colors: (
  primary: $color-000000,
  secondary: $color-2c2c2f,
  tertiary: $color-353535,
);

$state-bg-colors: ( // 특정 컴포넌트 상태에 대한 배경색
  delete: $color-df3b32,
  active: $color-ff7f00,
  neutral: $color-4d4d4d,
  start: $color-1b3d27,
  stop: $color-3d1616,
  hover: $color-414040,
);

...
```

<br />

**② 전역 값(values) 설계 기준**

전역에서 사용할 색상 토큰을 의미론적 단위로 정리한 이후, 레이아웃이나 크기처럼 숫자 값으로 사용되는 값들까지 전역 토큰으로 정의해야 하는지에 대해 고민하게 되었습니다.

검토 과정에서 전역 숫자 토큰을 사용하는 방식과 `rem`, `em`과 같은 상대 단위를 사용하는 방식 사이에서 실제로 체감 가능한 차이는 크지 않다고 판단했습니다. 두 방식 모두 결과적으로는 외부에 정의된 기준 값을 참조하여 스타일을 구성한다는 공통점을 가지기 때문입니다.

예를 들어, 다음과 같은 방식들은 모두 표현 방법은 다르지만 기준 값에 의존해 스타일을 결정합니다.

```tsx
// Tailwind 기반 Utility Class 부여
<button className="p-2 w-4 h-3">
  Click
</button>
```

```scss
// 전역 값 정의 후 map 기반으로 사용 시
button {
  padding: map.get($p, 2);
  width: map.get($w, 4);
  height: map.get($h, 3);
}
```

```scss
// 루트 요소에 font-size 지정 (현재 방식)
html, body {
  font-size: 4px;
}

button {
  padding: 2rem;
  width: 4rem;
  height: 3rem;
}
```

이처럼 Utility-First CSS, SCSS 전역 map 활용, rem 기반 상대 단위 방식은 모두 값을 직접 명시하지 않고, 기준이 되는 값을 통해 스타일을 적용한다는 점에서 구조적으로 유사하다고 판단했습니다. 차이는 기준이 클래스에 있느냐, SCSS 토큰에 있느냐, 혹은 루트 요소의 `font-size`에 있느냐 정도에 불과하다고 보았습니다.

또한 크기, 높이, 여백과 같이 숫자 값 자체에 명확한 의미가 없는 속성들까지 전역 토큰으로 관리하려면, SCSS의 map 자료형을 사용해 `w(width)`, `h(height)`, `p(padding)`, `m(margin)`과 같은 단위별 토큰을 정의하고, `w-1`, `w-2`, `w-3`과 같이 동일한 성격의 값들을 반복적으로 관리해야 합니다. 이러한 방식은 오히려 관리 대상과 추상화 계층만 불필요하게 증가시키는 결과로 이어질 수 있다고 판단했습니다.

```scss
// 예를 들어, 전역 토큰으로 관리하는 경우
$w: (
  $w-1: 1rem,
  $w-2: 2rem,
  $w-3: 3rem,
  $w-4: 4rem,
  ...
);

$h: (
  $h-1: 1rem,
  $h-2: 2rem,
  $h-3: 3rem,
  $h-4: 4rem,
  ...
);
```

이러한 이유로, 의미론적 가치가 없는 숫자 값들은 전역 토큰으로 정의하기보다는 CSS 차원에서 제공하는 상대 단위를 직접 활용하는 편이 더 단순하고 유지보수성 측면에서도 합리적이라고 결론지었습니다.

다만 `border-radius: 9999px`처럼 값 자체를 조정할 필요가 없고, "완전한 라운드"와 같이 시각적 의미가 명확한 경우에는 예외로 두었습니다. 이러한 값은 의미론적 토큰으로 전역에서 관리하는 편이 의도를 더 분명하게 드러낼 수 있다고 판단하여, 다음과 같이 정의했습니다.

```scss
// _values.scss
$rounded: (
  $full: 9999px
);
```

<br />

**③ 전역 SCSS 스타일 토큰 FSD 아키텍처에 맞춰 설계한 디렉토리 구조**

SCSS는 CSS 전처리기 언어이기 때문에, SCSS로 작성한 문법은 브라우저에서 사용되기 전에 CSS 문법으로 변환되는 컴파일 과정(정확히는 트랜스파일 과정)을 거쳐야 합니다.

이 과정에서 컴파일 대상에 포함되는 파일의 범위를 명확히 구분하는 것은 불필요한 빌드 작업을 줄이고, 결과적으로 빌드 시간을 최적화하는 데 도움이 됩니다. SCSS에서는 파일명 앞에 언더바(_)를 붙일 경우, 해당 파일을 직접적인 CSS 결과물로 컴파일하지 않고, 다른 SCSS 파일에서 참조되는 용도로만 사용할 수 있도록 설계되어 있습니다.

이러한 특성을 활용하여, 전역에서 공통으로 사용되는 색상이나 값과 같은 스타일 토큰 파일들은 실제 CSS를 생성할 필요 없이 값만 제공하면 되므로, 모두 컴파일 대상에서 제외하는 방식으로 관리했습니다.

또한 Clock 프로젝트는 FSD(Feautre-Sliced Design) 아키텍처를 기반으로 디렉토리 구조를 설계했기 때문에, 전역 스타일 토큰 역시 `shared` 레이어 하위에서 관리하는 것이 적절하다고 판단했습니다. 이에 따라 초기에는 다음과 같은 형태로, 컴파일 대상에서 제외된 전역 SCSS 변수 디렉토리 구조를 구성했습니다.

```md
src/
├── shared/
│   ├── styles/
│   │   ├── variables/
│   │   │   ├── _colors.scss
│   │   │   └── _values.scss
│   │   └── _variables.scss
│   └── ...
└── ...
```

하지만 이 구조를 그대로 사용할 경우, `variables`라는 디렉토리명과 `_variables.scss` 파일명이 중복되며, 진입점 역할을 하는 파일이 디렉토리 루트에 명확하게 드러나지 않는다는 문제가 있었습니다. 또한 파일명이 `index` 패턴을 따르지 않기 때문에, 전역 스타일 토큰을 사용할 때마다 명확한 경로를 작성해야 한다는 단점도 존재했습니다.

```scss
// _variables.scss 로직
@forward "./variables/colors";
@forward "./variables/values";
```

```scss
// 전역 스타일 토큰 사용 시 경로 예시
@use "@shared/styles/variables" as *;
```

이 구조를 그대로 유지할 경우, 이후 여러 곳에서 재사용되는 `mixin`이나 `function`과 같은 SCSS 로직이 추가될 때마다 `shared/styles` 하위에 디렉토리명과 파일명이 반복되는 구조가 계속해서 늘어나게 됩니다. 그 결과, 각 스타일 모듈의 책임 경계가 흐려질 뿐만 아니라, 디렉토리 루트에서 명확한 진입점 역할을 수행하는 파일을 파악하기 어려워진다고 판단했습니다.

```md
# 전역 mixin, function 로직이 추가되는 경우의 구조 예시
src/
├── shared/
│   ├── styles/
│   │   ├── variables/
│   │   │   └── ...
│   │   ├── mixins/
│   │   │   └── ...
│   │   ├── functions/
│   │   │   └── ...
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── _functions.scss
│   └── ...
└── ...
```

이러한 문제를 해결하기 위해, 기존 `_variables.scss`에서 사용하던 `@forward` 문법을 활용하면 FSD 아키텍처의 Public API 개념과 동일하게, 각 스타일 모듈의 `_index.scss` 파일로 명확히 분리할 수 있다고 판단했습니다.

즉, `shared/styles` 슬라이스 하위에 위치한 각 세그먼트가 개별적인 Public API를 가지도록 구성하고, 이를 다시 한 번 상위 `_index.scss`에서 통합 노출하는 구조로 전역 스타일 토큰 디렉토리를 리팩토링했습니다. 그 결과, FSD 아키텍처의 구조적 원칙에 부합한 구조로 리팩토링했습니다.

```md
# FSD 아키텍처 구조에 맞게 재설계한 전역 스타일 토큰 디렉토리
src/
├── shared/
│   ├── styles/
│   │   ├── variables/
│   │   │   ├── ...
│   │   │   └── _index.scss      # 전역에서 사용할 SCSS 변수 Public API
│   │   ├── mixins/
│   │   │   ├── ...
│   │   │   └── _index.scss      # 전역에서 재사용할 SCSS mixin Public API
│   │   ├── functions/
│   │   │   ├── ...
│   │   │   └── _index.scss      # 전역에서 재사용할 SCSS function Public API
│   │   │
│   │   └── _index.scss          # shared/styles 슬라이스의 최상위 Public API
│   └── ...
└── ...
```

<br />

## III. 컴포넌트 내부 SCSS 파일명 및 디렉토리 구조 통일

앞서 [I. SCSS 스타일 코드를 리팩토링을 하게 된 이유](#i-scss-스타일-코드를-리팩토링을-하게-된-이유)에서 Clock 프로젝트의 전반적인 SCSS 디렉토리 구조를 간략히 살펴보았습니다. 본 목차에서는 해당 구조를 기반으로, 컴포넌트 내부에서 사용되고 SCSS 파일들의 이름과 디렉토리 구성 방식을 조금 더 구체적으로 살펴보겠습니다.

```md
src/
├── features/
│   ├── swipe-to-delete/
│   │   ├── ui/
│   │   │   ├── SwipeToDeleteActions/
│   │   │   │   └── index.tsx             # 상위 index.module.scss의 styles를 Props로 전달받아 사용
│   │   │   ├── SwipeToDeleteContainer/
│   │   │   │   └── index.tsx             # 상위 index.module.scss의 styles를 Props로 전달받아 사용
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   └── ...
│   │
│   ├── time-picker/
│   │   ├── ui/
│   │   │   ├── Picker/
│   │   │   │   ├── index.module.scss     # 개별 SCSS 파일을 직접 사용하는 구조
│   │   │   │   └── index.tsx
│   │   │   ├── PickerWheel/
│   │   │   │   ├── index.module.scss     # 개별 SCSS 파일을 직접 사용하는 구조
│   │   │   │   └── index.tsx
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   └── ...
│   │
│   └── ...
│
├── widgets/
│   ├── navigator/
│   │   ├── ui/
│   │   │   ├── TabItem/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.styles.scss     # module이 아닌 styles 네이밍 사용 + 개별 SCSS 파일을 직접 사용하는 구조
│   │   │   │   ├── mixin.scss
│   │   │   │   └── variable.scss
│   │   │   ├── index.tsx
│   │   │   └── index.styles.scss
│   │   └── ...
│   │
│   └── ...
│
└── ...
```

위 디렉토리 구조에서 확인할 수 있듯이, 현재 Clock 프로젝트에서 사용되고 있는 컴포넌트 내부 SCSS 파일들은 파일명과 디렉토리 구성 방식이 일관되지 않은 상태입니다. 이러한 구조는 즉각적인 기능 오류를 발생시키지는 않지만, 프로젝트 전반의 가독성과 유지보수성 측면에서는 분명한 한계를 가지고 있습니다.

특히 향후 일부 스타일이나 컴포넌트를 수정해야 하는 상황이 발생할 경우, 각 디렉토리마다 서로 다른 구조와 규칙을 고려해야 하므로 수정 비용이 점점 증가할 수 있습니다. 또한 구조적인 통일성이 부족한 상태는 개발이 종료된 이후 별도의 정리나 개선이 이루어지지 않은 인상을 줄 수 있다고 보았습니다.

이러한 이유로, 컴포넌트 내부에서 사용되는 SCSS 파일의 이름과 디렉토리 구조를 통일하는 방향으로 리팩토링을 진행하기로 결정했습니다.

<br />
