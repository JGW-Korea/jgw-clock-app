import { forwardRef } from "react";

interface Props {
  list: ReadonlyArray<string | number>;
  wheel: ReadonlyArray<string | number>;
  label?: string;
  className?: string;
}

// 스크롤을 감지하기 위한 상수이다. Total보다 1을 더 크게 만드는 이유는 스크롤이 List 배열의 마지막 61번째 index에 도달하면, 0번으로 되돌리기 위해서이다. (무한 스크롤)

/**
 * Picker 컨테이너 각 열(Column)을 담당하는 컴포넌트
 * 
 * @param {ReadonlyArray<string | number>} list - 스크롤을 감지하기 위한 상수 배열이다. (무한 스크롤을 하기 위해서는 Wheel의 배열보다 1을 더 크게 설정하여, 마지막 인덱스 도달시 0번으로 되돌리기 위해 사용된다.)
 * @param {ReadonlyArray<string | number>} wheel - 실제 화면에 노출되는 값을 표현하기 위한 상수 배열이다.
*/
export default forwardRef<HTMLUListElement, Props>(function PickerWheel({ list, wheel, label, className }, ref) {
  return (
    <div className={`picker-control picker-control--${className} ${className}`}>
      {/* 화면에 리스트 내용은 노출되지 않으나, 실제 사용자의 스크롤을 감지하는 영역  */}
      <ul ref={ref} className={`picker-controller picker-controller--${className}`}>
        {list.map((value, idx) => (
          <li key={idx}>{value}</li>
        ))}
      </ul>

      {/* 상단의 ul의 스크롤에 맞춰 실제 화면에 내용을 노출하는 영역 */}
      <div className={`picker-wheel picker-wheel--${className}`}>
        {wheel.map((value, idx) => (
          <div key={idx} style={{ "--index": idx } as React.CSSProperties}>
            {value}
          </div>
        ))}
      </div>

      {/* 각 열(Column)의 역할(시간, 분, 초 등)을 설명하는 고정적인 라벨 영역 */}
      {!!label && (
        <div className={`picker-fixed-label`}>
          {label}
        </div>
      )}
    </div>
  );
});