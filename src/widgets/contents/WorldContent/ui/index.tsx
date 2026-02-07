import { useRef } from "react";
import styles from "./index.module.scss";
import WorldContentListItem from "./WorldContentListItem";
import type { WordTimeListType } from "@entities/world";
import type { EditMode } from "@features/list-edit";

interface Props {
  worldTimeList: WordTimeListType[];
  editMode: { click: boolean; swipe: boolean };
  onDelete: (id: number | string) => void;
  onEditModeActive: (type: keyof EditMode) => void;
}

export default function WorldContent({ worldTimeList, editMode, onDelete, onEditModeActive }: Props) {
  const activeRef = useRef<HTMLLIElement>(null);
  
  return (
    <main className={`${styles["layout"]} ${worldTimeList.length === 0 ? styles["layout-empty"] : ""}`}>
      {
        worldTimeList.length === 0
          ? <span>No World Clocks</span>
          : (
              <ul className={`${styles["layout-list"]}`}>
                {worldTimeList.map((world) => (
                  <WorldContentListItem
                    key={world.to}
                    activeRef={activeRef}
                    styles={styles}
                    world={world}
                    editMode={editMode}
                    onDeleteListItem={onDelete}
                    onEditModeActive={onEditModeActive}
                  />
                ))}
              </ul>
            )
      }
    </main>
  );
}
