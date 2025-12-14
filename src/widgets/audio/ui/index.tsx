import styles from "./index.module.scss";

interface Props {
  ref: React.RefObject<HTMLAudioElement | null>;
  type: "alarm" | "timer";
  visible: boolean;
}

export default function Audio({ ref, type, visible }: Props) {
  return (
    <div className={`${styles["audio"]} ${visible ? styles["hidden"] : ""}`}>
      <h3>{type === "alarm" ? "Alarm" : "Timer"}</h3>
      <audio ref={ref} src="/audio/alarm.mp3" muted loop style={{ display: "none" }} />
      <button
        // onClick={() => {
        //   if(!audioRef.current) return;
        //   audioRef.current.pause();
        // }}
      />
    </div>
  );
}

// ${!alarmState && styles["hidden"]}`}