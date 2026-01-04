import { Button } from "@shared/ui";

interface Props {
  styles: CSSModuleClasses;
  isActive: boolean;
  isPaused: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onResetTimer: () => void;
}

export default function TimerButtonGroup({ styles, isActive, isPaused, hours, minutes, seconds, onStartTimer, onStopTimer, onResetTimer }: Props) {
  return (
    <div className={styles["button-group"]}>
      <Button className={styles["start"]} disabled={isActive || hours + minutes + seconds === 0} onClick={onStartTimer} children={"Start"} />
      <Button className={styles["stop"]} disabled={!isActive} style={{ display: !isPaused ? "block" : "none" }} onClick={onStopTimer} children={"Stop"} />
      <Button className={styles["reset"]} style={{ display: isPaused ? "block" : "none" }} onClick={onResetTimer} children={"Reset"} />
    </div>
  )
}