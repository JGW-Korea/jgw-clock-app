import { Sheet } from "react-modal-sheet";
import styles from "./index.module.scss";
import Cancel from "@shared/assets/icons/plus.svg?react"
import Check from "@shared/assets/icons/check.svg?react"

// BottomSheetHeader가 기본적으로 가져야 하는 Props 구성
interface Props {
  sheetTitle: string;
  onClose: () => void;
  showRightButton: boolean;
  onRightButtonClick?: () => void;
}

/**
 * 전역 Bottom Sheet 컴포넌트 내부에서 사용될 Bottom Sheet Header 컴포넌트
 * - props를 디스트럭쳐링을 통해 구조를 분해하지 않는 이유는 구조적 타이핑 기준으로 평가할 때 showRightButton: false 때는 onTimePickerSelected가 없다고 판단이 된다.
 * - 이로 인해, 기존 props 구조를 분해하지 않고 조건부 타입을 통해 onTimePickerSelected에 접근한다.
 * 
 * @param {Props} props - BottomSheetHeader 컴포넌트에 전달할 데이터
*/
export default function BottomSheetHeader({ sheetTitle, onClose, showRightButton, onRightButtonClick }: Props) {
  
  return (
    <Sheet.Header className={`${styles["bottom-sheet-header"]}`}>
      <button className={`${styles["bottom-sheet-header__button"]} ${styles["bottom-sheet-header__button-left"]} liquid-glass`} onClick={onClose}>
        <Cancel width={24} height={24} style={{ transform: "rotate(45deg)" }} className={`${styles["bottom-sheet-header__button-svg-stroke"]}`} />
      </button>
      
      <h3 className={`${styles["bottom-sheet-header__title"]}`}>{sheetTitle}</h3>
      
      {/* Select Props가 전달된 경우 */}
      <button
        className={`${styles["bottom-sheet-header__button"]} ${styles["bottom-sheet-header__button-right"]}`}
        style={{ visibility: showRightButton ? "visible" : "hidden" }}
        onClick={onRightButtonClick}
      >
        <Check width={24} height={24} className={`${styles["bottom-sheet-header__button-svg-fill"]}`} />
      </button>
    </Sheet.Header>
  );
}
