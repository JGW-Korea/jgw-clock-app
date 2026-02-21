import style from "./index.module.scss";
import PlusIconSVGComponent from "@shared/assets/icons/plus.svg?react";
import CheckSVGComponent from "@shared/assets/icons/check.svg?react";
import { useContext } from "react";
import { AlarmContext, type AlarmContextType } from "@entities/alarm";
import Header from "@shared/ui/Header";
import type { EditMode } from "@features/list-edit";

interface Props {
  editMode: { click: boolean; swipe: boolean };
  onClickEditModeActive: (type: keyof EditMode) => void;
  onClickOpenSheet: () => void;
}

export default function AlarmHeader({ editMode, onClickEditModeActive, onClickOpenSheet }: Props) {
  const { alarmList } = useContext<AlarmContextType | null>(AlarmContext)!;
  
  return (
    <Header title="Alarms">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className={`${style["header-button"]} ${style["header-button__text"]} ${alarmList.length === 0 && style["header-button__hidden"]} liquid-glass fast`}
          onClick={() => onClickEditModeActive("click")}
          >
          {(editMode.click || editMode.swipe) ? <CheckSVGComponent /> : "Edit" }
        </button>
        <button className={`${style["header-button"]} liquid-glass fast`} onClick={onClickOpenSheet}>
          <PlusIconSVGComponent />
        </button>
      </div>
    </Header>
  );
}
