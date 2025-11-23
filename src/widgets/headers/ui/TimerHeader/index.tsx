import style from "./style.module.scss";
import Header from "../../../../shared/header";

interface Props {
  timerList: object[]
}

export default function TimerHeader({ timerList }: Props) {
  return (
    <Header title="Timers">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className={`${style["glass-button"]} ${style["glass-button__text"]}`}>
          Edit
        </button>
        {/* <button className={`${style["glass-button"]} ${style["glass-button__icon"]}`}>
          <PlusIcon />
        </button> */}
      </div>
    </Header>
  );
}
