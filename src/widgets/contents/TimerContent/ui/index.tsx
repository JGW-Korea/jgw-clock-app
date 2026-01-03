import { useTimer } from "../model/useTimer";
import CountDown from "./CountDown";
import styles from "./index.module.scss";
import SelectTime from "./SelectTime";

export default function TimerContent() {
  const { 
    timerState,
    timerStart,
    isPaused,
    progress,
    increment,
    decrement,
    handleStart,
    handleStop,
    handleReset
  } = useTimer();
  
  return (
    <main className={`${styles["container"]}`}>
      <CountDown styles={styles} timerState={timerState} progress={progress} />

      <div className={styles["button-group"]}>
        <button
          className={styles["start"]}
          disabled={timerStart || timerState.hours.value + timerState.minutes.value + timerState.seconds.value === 0}
          onClick={handleStart}
        >
          Start
        </button>
        <button
          className={styles["stop"]}
          onClick={handleStop}
          disabled={!timerStart}
          style={{ display: !isPaused ? "block" : "none" }}
        >
          Stop
        </button>
        <button
          className={styles["reset"]}
          onClick={handleReset}
          style={{ display: isPaused ? "block" : "none" }}
        >
          Reset
        </button>
      </div>

      <div className={`${styles["time-group"]}`}>
        <SelectTime styles={styles} label="hours" decrementDisabled={timerStart || !timerState.hours.decrement} incrementDisabled={timerStart || !timerState.hours.increment} decrement={decrement} increment={increment} />
        <SelectTime styles={styles} label="minutes" decrementDisabled={timerStart || !timerState.minutes.decrement} incrementDisabled={timerStart || !timerState.minutes.increment} decrement={decrement} increment={increment} />
        <SelectTime styles={styles} label="seconds" decrementDisabled={timerStart || !timerState.seconds.decrement} incrementDisabled={timerStart || !timerState.seconds.increment} decrement={decrement} increment={increment} />
      </div>
    </main>
  );
}