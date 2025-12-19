import CountDown from "./CountDown";
import styles from "./index.module.scss";

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
    </main>
  )
}