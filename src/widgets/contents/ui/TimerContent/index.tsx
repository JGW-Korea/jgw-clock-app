import CountDown from "./CountDown";
import styles from "./index.module.scss";
import SelectTime from "./SelectTime";

export default function TimerContent() {
  return (
    <main className={`${styles["container"]}`}>
      <CountDown styles={styles} />

      <div className={styles["button-group"]}>
        <button className={styles["reset"]} style={{ display: !false ? "block" : "none" }} >Reset</button>
        <button className={styles["start"]} style={{ display: !false ? "block" : "none" }} >Start</button>
        <button className={styles["lap"]} style={{ display: false ? "block" : "none" }} >Lap</button>
        <button className={styles["stop"]} style={{ display: false ? "block" : "none" }} >Stop</button>
      </div>

      <div className={`${styles["time-group"]}`}>
        <SelectTime styles={styles} label="hours" />
        <SelectTime styles={styles} label="minutes" />
        <SelectTime styles={styles} label="seconds" />
      </div>
    </main>
  )
}