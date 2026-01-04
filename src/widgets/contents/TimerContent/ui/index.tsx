import { useTimer } from "../model";
import styles from "./index.module.scss";
import TimerButtonGroup from "./TimerButtonGroup";
import TimerDisplay from "./TimerDisplay";
import TimerSelector from "./TimerSelector";

export default function TimerContent() {
  const {
    timerState: { isActive, isPaused, hours, minutes, seconds },
    progress,
    timerIncrement,
    timerDecrement,
    handleStartTimer,
    handleStopTimer,
    handleResetTimer
  } = useTimer();
  
  return (
    <main className={`${styles["container"]}`}>
      <TimerDisplay styles={styles} hours={String(hours)} minutes={String(minutes)} seconds={String(seconds)} progress={progress} />

      <TimerButtonGroup
        styles={styles}
        isActive={isActive}
        isPaused={isPaused}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onStartTimer={handleStartTimer}
        onStopTimer={handleStopTimer}
        onResetTimer={handleResetTimer}
      />

      <div className={`${styles["time-group"]}`}>
        <TimerSelector styles={styles} label="hours" decrementDisabled={isActive || !!(hours - 1 === -1)} incrementDisabled={isActive || !!(hours + 1 === 24)} decrement={timerDecrement} increment={timerIncrement} />
        <TimerSelector styles={styles} label="minutes" decrementDisabled={isActive || !!(minutes - 1 === -1)} incrementDisabled={isActive || !!(minutes + 1 === 60)} decrement={timerDecrement} increment={timerIncrement} />
        <TimerSelector styles={styles} label="seconds" decrementDisabled={isActive || !!(seconds - 1 === -1)} incrementDisabled={isActive || !!(seconds + 1 === 60)} decrement={timerDecrement} increment={timerIncrement} />
      </div>
    </main>
  );
}