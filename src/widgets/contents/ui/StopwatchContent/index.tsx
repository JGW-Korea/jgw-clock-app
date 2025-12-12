import { useRef, useState } from "react";
import style from "./index.module.scss";
import StopWatchListItem from "./StopWatchListItem";

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
    <main className={style["conatinaer"]}>
      <div className={style["timer-wrapper"]}>
        <p>
          <time>{String(timer.minutes).padStart(2, "0")}</time>
          :
          <time>{String(timer.seconds).padStart(2, "0")}</time>
          .
          <time>{String(timer.milliseconds).padStart(2, "0")}</time>
        </p>
      </div>

      <div className={style["button-group"]}>
        <button className={style["reset"]} style={{ display: !stopwatchMode ? "block" : "none" }} onClick={onResetStopwatch}>Reset</button>
        <button className={style["start"]} style={{ display: !stopwatchMode ? "block" : "none" }} onClick={onStartStopwatch}>Start</button>
        <button className={style["lap"]} style={{ display: stopwatchMode ? "block" : "none" }} onClick={addLap}>Lap</button>
        <button className={style["stop"]} style={{ display: stopwatchMode ? "block" : "none" }} onClick={onStopStopwatch}>Stop</button>
      </div>

      <ul className={style["laps"]}>
        {laps.map(({ minutes, seconds, milliseconds, id }) => (
          <StopWatchListItem
            key={id}
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
