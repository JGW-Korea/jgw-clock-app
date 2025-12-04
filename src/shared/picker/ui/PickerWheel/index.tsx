import { forwardRef } from "react";

interface Props {
  items: (string | number)[];
  label?: string;
  className?: string;
}

/**
 * Picker 컨테이너 각 열(Column)을 담당하는 컴포넌트
*/
export default forwardRef<HTMLUListElement, Props>(function PickerWheel({ items, label, className }, ref) {
  return (
    <div className={`picker-control picker-control--${className} ${className}`}>
      {/* 화면에 리스트 내용은 노출되지 않으나, 실제 사용자의 스크롤을 감지하는 영역  */}
      <ul ref={ref} className={`picker-controller picker-controller--${className}`}>
        {items.map((value, idx) => (
          <li key={idx}>{value}</li>
        ))}
      </ul>

      {/* 상단의 ul의 스크롤에 맞춰 실제 화면에 내용을 노출하는 영역 */}
      <div className={`picker-wheel picker-wheel--${className}`}>
        {items.map((value, idx) => (
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