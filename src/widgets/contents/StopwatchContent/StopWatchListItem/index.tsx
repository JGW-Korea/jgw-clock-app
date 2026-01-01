import styles from "./index.module.scss";
import { ListItem } from "@shared/ui";

interface Props {
  id: number;
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
}

/**
 * Stopwatch 내부에서만 사용될 ListItem 컴포넌트
*/
export default function StopWatchListItem({ id, hours, minutes, seconds, milliseconds }: Props) {
  return (
    <ListItem padding={4}>
      <article className={`${styles["stopwatch-list-item-container"]}`}>
        <span>Lap {id}</span>
        <time dateTime={`${hours}:${minutes}:${seconds}.${milliseconds}`} className={styles["stopwatch-list-item-container__timer"]}>
          <span>{minutes}</span>:
          <span>{seconds}</span>.
          <span>{milliseconds}</span>
        </time>
      </article>
    </ListItem>
  );
}
