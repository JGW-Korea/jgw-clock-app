import { useRef, useState } from "react";
import styles from "./index.module.scss";
import StopWatchListItem from "./StopWatchListItem";
import StopWatchButtonGroup from "./StopWatchButtonGroup";

type Timer = { minutes: number, seconds: number, milliseconds: number };

export default function StopwatchContent() {
  const [stopwatchMode, setStopwatchMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<Timer>({ minutes: 0, seconds: 0, milliseconds: 0 });
  const [currentTimer, setCurrentTimer] = useState<Timer>({ minutes: 0, seconds: 0, milliseconds: 0 });
  const [laps, setLaps] = useState<(Timer & { id: number })[]>([]);
  const stopwatchIntervalId = useRef<number | null>(null);

  const startTimer = (setUpdateTimer: React.Dispatch<React.SetStateAction<Timer>>): void => {
    setUpdateTimer((prev) => {
      const currentTime = prev;

      currentTime.milliseconds += 1;
      if(currentTime.milliseconds > 99) {
        currentTime.seconds += 1;
        currentTime.milliseconds = 0;
      }

      if(currentTime.seconds > 59) {
        currentTime.minutes += 1;
        currentTime.seconds = 0;
      }

      return { ...currentTime }
    });
  }

  const addLap = () => {
    setLaps((prev) => {
      if(prev.length === 0) return [{ id: 1, ...currentTimer}];
      else {
        prev[0].minutes = currentTimer.minutes
        prev[0].seconds = currentTimer.seconds
        prev[0].milliseconds = currentTimer.milliseconds

        return [
          ...prev,
          {
            id: prev.length + 1,
            ...{minutes: 0, seconds: 0, milliseconds: 0}
          }
        ].sort((a, b) => b.id - a.id);
      }
    });
    
    setCurrentTimer({ minutes: 0, seconds: 0, milliseconds: 0 });
  }

  const onStartStopwatch = () => {
    setStopwatchMode(true);

    if(!laps.length) addLap();

    stopwatchIntervalId.current = setInterval(() => {
      startTimer(setTimer);
      startTimer(setCurrentTimer);
    }, 10);
  }

  const onStopStopwatch = () => {
    if(!stopwatchIntervalId.current) return;
    
    setStopwatchMode(false);

    clearInterval(stopwatchIntervalId.current)
  }

  const onResetStopwatch = () => {
    setTimer({minutes: 0, seconds: 0, milliseconds: 0});
    setLaps([]);
  }

  return (
    <main className={styles["conatinaer"]}>
      {/* Stopwatch가 지난 시간 */}
      <div className={styles["timer-wrapper"]}>
        <time dateTime={`${String(Math.floor(timer.minutes / 60)).padStart(2, "0")}:${String(timer.minutes % 60).padStart(2, "0")}:${String(timer.seconds).padStart(2, "0")}.${String(timer.milliseconds).padStart(2, "0")}`}>
          <span>{String(timer.minutes).padStart(2, "0")}</span>
          :
          <span>{String(timer.seconds).padStart(2, "0")}</span>
          .
          <span>{String(timer.milliseconds).padStart(2, "0")}</span>
        </time>
      </div>

      {/* Stopwatch의 실행을 제어할 버튼 그룹 컴포넌트 */}
      <StopWatchButtonGroup
        mode={stopwatchMode}
        styles={styles}
        onResetStopwatch={onResetStopwatch}
        onStartStopwatch={onStartStopwatch}
        onAppendLabStopwatch={addLap}
        onStopStopwatch={onStopStopwatch}
      />

      {/* Stopwatch의 기록을 나타내는 컴포넌트 */}
      <ul className={styles["laps"]}>
        {laps.map(({ minutes, seconds, milliseconds, id }) => (
          <StopWatchListItem
            key={id}
            styles={styles}
            id={id}
            hours={id === laps.length ? String(Math.floor(currentTimer.minutes / 60)).padStart(2, "0") : String(Math.floor(minutes / 60)).padStart(2, "0")}
            minutes={id === laps.length ? String(currentTimer.minutes).padStart(2, "0") : String(minutes).padStart(2, "0")}
            seconds={id === laps.length ? String(currentTimer.seconds).padStart(2, "0") : String(seconds).padStart(2, "0")}
            milliseconds={id === laps.length ? String(currentTimer.milliseconds).padStart(2, "0") : String(milliseconds).padStart(2, "0")}
          />
        ))}
      </ul>
    </main>
  );
}
