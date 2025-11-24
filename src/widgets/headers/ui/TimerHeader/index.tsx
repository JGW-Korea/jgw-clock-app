import style from "./style.module.scss";
import Header from "../../../../shared/header";

export default function TimerHeader() {
  return (
    <Header title="Timers">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className={`${style["glass-button"]} ${style["glass-button__text"]}`}>
          Edit
        </button>
      </div>
    </Header>
  );
}
