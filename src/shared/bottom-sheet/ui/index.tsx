import { Sheet, type SheetProps } from "react-modal-sheet";
import styles from "./index.module.scss";
import BottomSheetHeader from "./BottomSheetHeader";

interface Props extends SheetProps {
  sheetTitle: string;

} 

/**
 * 각 라우트에서 재사용할 전역 BottomSheet 컴포넌트 Content 내부의 구성만 호출하는 쪽에서 구성하여 Content를 구성한다.
 * 
 * @param param0 
 * @returns 
 */
export default function BottomSheet({ sheetTitle, children, ...props }: Props) {
  return (
    <Sheet {...props} className={`${styles["bottom-sheet"]}`}>
      <Sheet.Container className={`${styles["bottom-sheet-container"]}`}>
        <BottomSheetHeader sheetTitle={sheetTitle} onClose={props.onClose}  />

        <Sheet.Content>
          {children}
        </Sheet.Content>
      </Sheet.Container>
      
      <Sheet.Backdrop className={`${styles["bottom-sheet-backdrop"]}`} />
    </Sheet>
  )
}