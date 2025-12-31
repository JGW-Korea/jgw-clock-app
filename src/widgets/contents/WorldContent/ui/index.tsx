import { useRef } from "react";
import style from "./index.module.scss";
import WorldContentListItem from "./WorldContentListItem";
import type { WordTimeListType } from "@entities/world";

interface Props {
  worldTimeList: WordTimeListType[];
  editMode: { click: boolean; swipe: boolean };
  onDelete: (id: number | string) => void;
  onEditModeActive: (type?: "click" | "swipe") => void;
}

export default function WorldContent({ worldTimeList, editMode, onDelete, onEditModeActive }: Props) {
  const activeRef = useRef<HTMLLIElement>(null);
  
  return (
    <main className={`${style["layout"]} ${worldTimeList.length === 0 ? style["layout-empty"] : ""}`}>
      {
        worldTimeList.length === 0
          ? <span>No World Clocks</span>
          : (
              <ul className={`${style["layout-list"]}`} style={{ width: "100%" }}>
                {worldTimeList.map((world) => (
                  <WorldContentListItem
                    key={world.to}
                    activeRef={activeRef}
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
