import styles from "./index.module.scss";

interface PickerProps {
  children: React.ReactElement[];
}

/**
 * Picker 컨테이너 역할을 수행하는 컴포넌트
*/
export default function Picker({ children }: PickerProps) {
  return (
    <div className={styles["picker"]}>
      <div className={styles["picker-controls"]}>
        {children}
      </div>
    </div>
  );
}
