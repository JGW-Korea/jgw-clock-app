import { Button } from "@shared/ui";
import type { TimerState } from "../../model";

interface Props {
  styles: CSSModuleClasses;
  timerStart: boolean;
  isPaused: boolean;
  hours: TimerState["hours"];
  minutes: TimerState["hours"];
  seconds: TimerState["hours"];
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function TimerButtonGroup({ styles, timerStart, isPaused, hours, minutes, seconds, onStart, onStop, onReset }: Props) {
  return (
    <div className={styles["button-group"]}>
      <Button className={styles["start"]} disabled={timerStart || hours.value + minutes.value + seconds.value === 0} onClick={onStart} children={"Start"} />
      <Button className={styles["stop"]} disabled={!timerStart} style={{ display: !isPaused ? "block" : "none" }} onClick={onStop} children={"Stop"} />
      <Button className={styles["reset"]} style={{ display: isPaused ? "block" : "none" }} onClick={onReset} children={"Reset"} />
    </div>
  )
}