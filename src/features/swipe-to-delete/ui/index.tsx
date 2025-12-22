import { ListItem } from "@shared/ui";
import { useSwipeToDelete } from "../model";
import styles from "./index.module.scss";
import SwipeToDeleteActions from "./SwipeToDeleteActions";
import SwipeToDeleteContainer from "./SwipeToDeleteContainer";

interface Props {
  activeRef: React.RefObject<HTMLLIElement | null>;
  children: React.ReactElement;
  id: number | string;
  editMode: { click: boolean; swipe: boolean };
  padding?: number;
  onDeleteListItem: (id: number | string, type?: "swipe", cb?: () => void) => void;
  onEditModeActive: (type?: "click" | "swipe") => void;
}

/**
 * Swipe 기능을 통해 삭제가 가능한 ListItem 컴포넌트
*/
export default function SwipeToDelete({ activeRef, children, id, editMode, padding, onEditModeActive, onDeleteListItem }: Props) {
  const { listItemRef, handlePointerDown, handlePointerMove, handlePointerEnd } = useSwipeToDelete(activeRef, editMode, onEditModeActive);

  return (
    <ListItem ref={listItemRef} padding={padding} className={`${styles["swipe-to-delete"]}`} style={{ "--translate-x": "0" } as React.CSSProperties}>
      <SwipeToDeleteActions className={`${styles["swipe-to-delete__actions"]}`} id={id} onDeleteListItem={() => onDeleteListItem(id, "swipe", onEditModeActive)} />
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
