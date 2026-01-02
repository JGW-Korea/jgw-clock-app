import styles from "./index.module.scss";
import StopWatchListItem from "./StopWatchListItem";
import StopWatchButtonGroup from "./StopWatchButtonGroup";
import { useStopwatch } from "../model";

export default function StopwatchContent() {
  const {
    stopwatch: { mode, totalTime, currentTime },
    laps,
    handleStartStopwatch,
    handleStopStopwatch,
    handleResetStopwatch,
    handleRecordStopwatch
  } = useStopwatch();

  return (
    <main className={styles["conatinaer"]}>
      {/* Stopwatch가 지난 시간 */}
      <div className={styles["timer-wrapper"]}>
        <time dateTime={`${String(Math.floor(totalTime.minutes / 60)).padStart(2, "0")}:${String(totalTime.minutes % 60).padStart(2, "0")}:${String(totalTime.seconds).padStart(2, "0")}.${String(totalTime.milliseconds).padStart(2, "0")}`}>
          <span>{String(totalTime.minutes).padStart(2, "0")}</span>
          :
          <span>{String(totalTime.seconds).padStart(2, "0")}</span>
          .
          <span>{String(totalTime.milliseconds).padStart(2, "0")}</span>
        </time>
      </div>

      {/* Stopwatch의 실행을 제어할 버튼 그룹 컴포넌트 */}
      <StopWatchButtonGroup
        mode={mode}
        styles={styles}
        onResetStopwatch={handleResetStopwatch}
        onStartStopwatch={handleStartStopwatch}
        onAppendLabStopwatch={handleRecordStopwatch}
        onStopStopwatch={handleStopStopwatch}
      />

      {/* Stopwatch의 기록을 나타내는 컴포넌트 */}
      <ul className={styles["laps"]}>
        {laps.map(({ minutes, seconds, milliseconds, id }) => (
          <StopWatchListItem
            key={id}
            styles={styles}
            id={id}
            hours={id === laps.length ? String(Math.floor(currentTime.minutes / 60)).padStart(2, "0") : String(Math.floor(minutes / 60)).padStart(2, "0")}
            minutes={id === laps.length ? String(currentTime.minutes).padStart(2, "0") : String(minutes).padStart(2, "0")}
            seconds={id === laps.length ? String(currentTime.seconds).padStart(2, "0") : String(seconds).padStart(2, "0")}
            milliseconds={id === laps.length ? String(currentTime.milliseconds).padStart(2, "0") : String(milliseconds).padStart(2, "0")}
          />
        ))}
      </ul>
    </main>
  );
}
