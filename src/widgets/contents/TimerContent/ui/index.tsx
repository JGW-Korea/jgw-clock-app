import { useTimer } from "../model";
import styles from "./index.module.scss";
import TimerButtonGroup from "./TimerButtonGroup";
import TimerDisplay from "./TimerDisplay";
import TimerSelector from "./TimerSelector";

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
      <TimerDisplay styles={styles} hours={String(timerState.hours.value)} minutes={String(timerState.minutes.value)} seconds={String(timerState.seconds.value)} progress={progress} />

      <TimerButtonGroup
        styles={styles}
        timerStart={timerStart}
        isPaused={isPaused}
        hours={timerState.hours}
        minutes={timerState.minutes}
        seconds={timerState.seconds}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
      />

      <div className={`${styles["time-group"]}`}>
        <TimerSelector styles={styles} label="hours" decrementDisabled={timerStart || !timerState.hours.decrement} incrementDisabled={timerStart || !timerState.hours.increment} decrement={decrement} increment={increment} />
        <TimerSelector styles={styles} label="minutes" decrementDisabled={timerStart || !timerState.minutes.decrement} incrementDisabled={timerStart || !timerState.minutes.increment} decrement={decrement} increment={increment} />
        <TimerSelector styles={styles} label="seconds" decrementDisabled={timerStart || !timerState.seconds.decrement} incrementDisabled={timerStart || !timerState.seconds.increment} decrement={decrement} increment={increment} />
      </div>
    </main>
  );
}