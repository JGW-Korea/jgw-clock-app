import styles from "./index.module.scss";
import type { WordTimeListType } from "@entities/world";
import { SwipeToDelete } from "@features/swipe-to-delete";
import { useTimeContinue } from "../../model";
import type { EditMode } from "@features/list-edit";

interface Props {
  world: WordTimeListType;
  activeRef: React.RefObject<HTMLLIElement | null>;
  editMode: { click: boolean; swipe: boolean };
  onDeleteListItem: (id: number | string, type?: "swipe", cb?: (type: keyof EditMode) => void) => void;
  onEditModeActive: (type: keyof EditMode) => void;
}

/**
 * 사용자가 선택한 각 도시의 리스트 컴포넌트
*/
export default function WorldContentListItem({ activeRef, world, editMode, onDeleteListItem, onEditModeActive }: Props) {
  const { timeStatus } = useTimeContinue(world);
  
  return (
    <SwipeToDelete activeRef={activeRef} id={world.to} editMode={editMode} padding={4} onEditModeActive={onEditModeActive} onDeleteListItem={onDeleteListItem}>
      <article className={`${styles["world-list-item"]} ${editMode.click ? styles["edit-mode"] : ""}`}>
        <button className={`${styles["world-list-item__delete-btn"]}`} onClick={() => onDeleteListItem(world.to, undefined, onEditModeActive)} />
        
        <div className={`${styles["world-list-item__content"]}`}>
          <div className={`${styles["world-list-item__content-city"]}`}>
            <p>{timeStatus?.day}, {Math.floor(world.offset / 3600)}hour</p>
            <h3>{world.name}</h3>
          </div>

          <time dateTime={`${timeStatus?.time.split(":")[0].padStart(2, "0")}:${timeStatus?.time.split(":")[1]}`} className={`${styles["world-list-item__content-time"]} ${editMode.click ? styles["hidden"] : ""}`}>
            <span>{timeStatus?.time}</span>
            {timeStatus?.target}
          </time>
        </div>
      </article>
    </SwipeToDelete>
  );
}