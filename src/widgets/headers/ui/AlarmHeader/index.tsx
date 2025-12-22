import style from "./style.module.scss";
import Check from "../../../../shared/assets/icons/check.svg?react";
import PlusIcon from "../../../../shared/assets/icons/plus.svg?react";
import { useContext } from "react";
import type { ClockContextType } from "../../../../shared/context/types";
import { AlarmContext } from "@entities/alarm";
import { Header } from "@shared/ui";

interface Props {
  editMode: { click: boolean; swipe: boolean };
  onClickEditModeActive: (type?: "click" | "swipe") => void;
  onClickOpenSheet: () => void;
}

export default function AlarmHeader({ editMode, onClickEditModeActive, onClickOpenSheet }: Props) {
  const { alarmList } = useContext<ClockContextType | null>(AlarmContext)!;
  
  return (
    <Header title="Alarms">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className={`${style["glass-button"]} ${style["glass-button__text"]} ${alarmList.length === 0 && style["glass-button__hidden"]}`}
          onClick={() => onClickEditModeActive("click")}
          >
          {(editMode.click || editMode.swipe) ? <Check /> : "Edit" }
        </button>
        <button className={`${style["glass-button"]} ${style["glass-button__icon"]}`} onClick={onClickOpenSheet}>
          <PlusIcon />
        </button>
      </div>
    </Header>
  );
}
