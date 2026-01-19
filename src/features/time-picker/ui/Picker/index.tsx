
interface PickerProps {
  styles: CSSModuleClasses;
  children: React.ReactElement[];
  onPointerOver?: () => void;
  onPointerLeave?: () => void;
}

/**
 * Picker 컨테이너 역할을 수행하는 컴포넌트
*/
export default function Picker({ styles, children, onPointerOver, onPointerLeave }: PickerProps) {
  return (
    <div className={styles["picker"]} onPointerEnter={onPointerOver} onPointerLeave={onPointerLeave}>
      <div className={styles["picker-controls"]}>
        {children}
      </div>
    </div>
  );
}
