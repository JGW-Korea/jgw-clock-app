import { ListItem } from "@shared/ui";

interface Props {
  styles: CSSModuleClasses;
  id: number;
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
}

/**
 * Stopwatch 내부에서만 사용될 ListItem 컴포넌트
*/
export default function StopWatchListItem({ styles, id, hours, minutes, seconds, milliseconds }: Props) {
  return (
    <ListItem padding={4}>
      <article className={`${styles["laps-item"]}`}>
        <span>Lap {id}</span>
        <time dateTime={`${hours}:${minutes}:${seconds}.${milliseconds}`} className={styles["laps-item__timer"]}>
          <span>{minutes}</span>:
          <span>{seconds}</span>.
          <span>{milliseconds}</span>
        </time>
      </article>
    </ListItem>
  );
}
