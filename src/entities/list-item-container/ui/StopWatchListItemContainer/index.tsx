import styles from "./index.module.scss";

export interface Props {
  id: number;
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
}

/**
 * Stopwatch 라우트 내에서 사용될 ListItem 컴포넌트의 내부 레이아웃 구조를 담당하는 컴포넌트
 * 
 * @param {Props} props - ListItem Container 컴포넌트 내에서 사용될 데이터 구조
 * @property id - Stopwatch의 Laps 값
 * @property hours - Stopwatch의 경과 시간(hours) *화면에는 단순 minutes만 출력되지만, time 태그의 dateTime의 속성값으로 사용하기 위해 전달됨
 * @property minutes - Stopwatch의 경과된 분(minutes)
 * @property seconds - Stopwatch의 경과된 초(seconds)
 * @property milliseconds - Stopwatch의 경과된 밀리초(milliseconds)
 */
export default function StopWatchListItemContainer({ id, hours, minutes, seconds, milliseconds }: Props) {
  return (
    <article className={`${styles["stopwatch-list-item-container"]}`}>
      <span>Lap {id}</span>
      <time dateTime={`${hours}:${minutes}:${seconds}.${milliseconds}`} className={styles["stopwatch-list-item-container__timer"]}>
        <span>{minutes}</span>:
        <span>{seconds}</span>.
        <span>{milliseconds}</span>
      </time>
    </article>
  );
}