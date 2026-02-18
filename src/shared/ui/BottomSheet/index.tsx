import BottomSheetHeader from "./BottomSheetHeader";
import { Sheet, type SheetProps } from "react-modal-sheet";
import styles from "./index.module.scss";

interface Props extends SheetProps {
  sheetTitle: string;
  showRightButton?: boolean;
  onRightButtonClick?: () => void;
} 

/**
 * 각 라우트에서 재사용할 전역 BottomSheet 컴포넌트 Content 내부의 구성만 호출하는 쪽에서 구성하여 Content를 구성한다.
 * 
 * @param param0 
 * @returns 
 */
export default function BottomSheet({ children, sheetTitle, showRightButton = false, onRightButtonClick, ...props }: Props) {
  return (
    <Sheet {...props} className={`${styles["bottom-sheet"]}`}>
      <Sheet.Container className={`${styles["bottom-sheet-container"]}`}>
        <BottomSheetHeader sheetTitle={sheetTitle} showRightButton={showRightButton} onRightButtonClick={onRightButtonClick} onClose={props.onClose}  />

        <Sheet.Content className={`${styles["bottom-sheet-content"]}`}>
          {children}
        </Sheet.Content>
      </Sheet.Container>
      
      <Sheet.Backdrop className={`${styles["bottom-sheet-backdrop"]}`} />
    </Sheet>
  )
}