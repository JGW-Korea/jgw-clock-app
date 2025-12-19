import CountDown from "./CountDown";
import styles from "./index.module.scss";

export default function TimerContent() {
  return (
    <main className={`${styles["container"]}`}>
      <CountDown styles={styles} />
    </main>
  )
}