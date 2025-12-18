/**
 * Reducer 함수의 Action.type에 맞는 상태를 변경하기 위한 유틸 함수
*/
export function patchState<T>(state: T, key: keyof T, value: T[keyof T]): T {
  return {
    ...state,
    [key]: value
  }
}