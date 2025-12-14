import styles from "./index.module.scss";

interface Props {
  ref: React.RefObject<HTMLAudioElement | null>;
  type: "alarm" | "timer";
  onClick: () => void;
}

export default function Audio({ ref, type, onClick }: Props) {
  return (
    <div className={`${styles["audio"]}`}>
      <h3>{type === "alarm" ? "Alarm" : "Timer"}</h3>
      <audio ref={ref} src="/audio/alarm.mp3" muted loop style={{ display: "none" }} />
      <button onClick={onClick} />
    </div>
  );
}