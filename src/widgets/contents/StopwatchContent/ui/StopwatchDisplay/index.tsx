interface Props{
  styles: CSSModuleClasses;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export default function StopwatchDisplay({ styles, minutes, seconds, milliseconds }: Props) {
  return (
    <div className={styles["timer-wrapper"]}>
      <time dateTime={`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`}>
        <span>{String(minutes).padStart(2, "0")}</span>
        :
        <span>{String(seconds).padStart(2, "0")}</span>
        .
        <span>{String(milliseconds).padStart(2, "0")}</span>
      </time>
    </div>
  );
}
