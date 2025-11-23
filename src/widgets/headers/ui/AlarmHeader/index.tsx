import style from "./style.module.scss";
import Header from "../../../../shared/header";
import PlusIcon from "../../../../shared/assets/icons/plus.svg?react";

interface Props {
  alarmList: object[]
}

export default function AlarmHeader({ alarmList }: Props) {
  return (
    <Header title="Alarms">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className={`${style["glass-button"]} ${style["glass-button__text"]} ${alarmList.length === 0 && style["glass-button__hidden"]}`}>
          Edit
        </button>
        <button className={`${style["glass-button"]} ${style["glass-button__icon"]}`}>
          <PlusIcon />
        </button>
      </div>
    </Header>
  );
}
