> ☝️ 이 문서는 이전 프로젝트에서 사용하던 디렉토리 구조로 인해 발생한 문제를 바탕으로, 이번 Clock 프로젝트에서 FSD 아키텍처를 도입하게 된 이유를 정리한 문서입니다.

## I. 기존에 사용하던 디렉토리 구조

Clock 프로젝트 이전까지는 개인 프로젝트든 팀 프로젝트든 관계없이, 다음과 명확한 기준 없이 디렉토리의 의미만 정의한 상태로 프로젝트를 진행해 왔습니다.

```md
src/
├─ api/
├─ assets/
├─ components/
├─ hooks/
├─ pages/
│  └─ pageA/
│     ├─ components/
│     │  ├─ componentA/
│     │  ├─ componentB/
│     │  └─ componentC/
│     └─ index.tsx
└─ App.tsx
```

> 🗂️ 이전 프로젝트에서 사용하던 디렉토리 구조는 [PICKY-FE](https://github.com/LG-Uplus-Movie-SNS-PICKY/PICKY-FE) 리포지토리에서 확인할 수 있습니다.

## II. 기존에 사용하던 디렉토리 구조 문제점