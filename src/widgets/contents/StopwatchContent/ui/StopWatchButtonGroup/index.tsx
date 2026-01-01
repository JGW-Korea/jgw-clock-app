import { Button } from "@shared/ui";

interface Props {
  styles: CSSModuleClasses;
  mode: boolean;
  onResetStopwatch: React.MouseEventHandler<HTMLButtonElement>;
  onStartStopwatch: React.MouseEventHandler<HTMLButtonElement>;
  onAppendLabStopwatch: React.MouseEventHandler<HTMLButtonElement>;
  onStopStopwatch: React.MouseEventHandler<HTMLButtonElement>;
}

export default function StopWatchButtonGroup({ styles, mode, onResetStopwatch, onStartStopwatch, onAppendLabStopwatch, onStopStopwatch }: Props) {
  return (
    <div className={`${styles["button-group"]}`}>
      <Button className={`${styles["reset"]}`} style={{ display: !mode ? "block" : "none" }} onClick={onResetStopwatch} children={"Reset"} />
      <Button className={`${styles["start"]}`} style={{ display: !mode ? "block" : "none" }} onClick={onStartStopwatch} children={"Start"} />
      <Button className={`${styles["lap"]}`} style={{ display: mode ? "block" : "none" }} onClick={onAppendLabStopwatch} children={"Lap"} />
      <Button className={`${styles["stop"]}`} style={{ display: mode ? "block" : "none" }} onClick={onStopStopwatch} children={"Stop"} />
    </div>
  );
}
