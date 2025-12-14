import { ListItem } from "../../../shared/list-item";
import { useSwipeToDelete } from "../model";
import styles from "./index.module.scss";
import SwipeToDeleteActions from "./SwipeToDeleteActions";
import SwipeToDeleteContainer from "./SwipeToDeleteContainer";

interface Props {
  activeRef: React.RefObject<HTMLLIElement | null>;
  children: React.ReactElement;
}

/**
 * Swipe 기능을 통해 삭제가 가능한 ListItem 컴포넌트
*/
export default function SwipeToDelete({ activeRef, children }: Props) {
  const { listItemRef, handlePointerDown, handlePointerMove, handlePointerEnd } = useSwipeToDelete(activeRef);

  return (
    <ListItem ref={listItemRef} className={`${styles["swipe-to-delete"]}`} style={{ "--translate-x": "0" } as React.CSSProperties}>
      <SwipeToDeleteActions className={`${styles["swipe-to-delete__actions"]}`} />
      <SwipeToDeleteContainer
        className={`${styles["swipe-to-delete__container"]}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      >
        {children}
      </SwipeToDeleteContainer>
    </ListItem>
  );
}
