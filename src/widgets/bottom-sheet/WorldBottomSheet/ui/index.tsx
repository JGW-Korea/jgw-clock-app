import WorldSheetListItem from "./WorldBottomSheetListItem";
import { BottomSheet } from "@shared/ui";
import { useWorldTimeFetch, type WorldAppendHandler } from "../model";
import styles from "./index.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClickAppendWorld: WorldAppendHandler;
}

// const BottomSheet = lazy(() => import("@shared/ui").then((moduel) => ({ default: moduel.BottomSheet })));

/**
 * World Route 내에서 독립적으로 사용되는 Bottom Sheet 컴포넌트
 * 
 * @param {boolean} props.isOpen - Bottom Sheet 활성화 여부
 * @param {Function} props.onClose - Bottom Sheet 활성화 시 클릭을 통해 비활성화 시키는 이벤트 리스너
 * @param {WorldAppendHandler} props.onClickAppendWorld - List Time Zone 리스트 클릭 시 세계 시간 추가를 위한 클릭 이벤트 리스너
*/
export default function WorldBottomSheet({ isOpen, onClose, onClickAppendWorld }: Props) {
  const { worldTimeListData } = useWorldTimeFetch();
  
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} sheetTitle="Choose a City">
      <ul className={`${styles["world-sheet-content"]}`}>
        {worldTimeListData.map(({ countryName, zoneName }) => {
          return (
            <WorldSheetListItem
              key={zoneName}
              countryName={countryName}
              zoneName={zoneName}
              onClickAppendWorld={onClickAppendWorld}
            />
          );
        })}
      </ul>
    </BottomSheet>
  )
}