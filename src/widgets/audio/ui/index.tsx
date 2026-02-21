import { useAudioControl } from "../model";
import styles from "./index.module.scss";

export default function Audio() {
  const { audioRef, audioType, handleAudioHidden } = useAudioControl();
  
  return (
    <div className={`${styles["audio"]}`}>
      <h3>{audioType === "alarm" ? "Alarm" : "Timer"}</h3>
      <audio ref={audioRef} src="/audio/alarm.mp3" muted loop style={{ display: "none" }} />
      <button
        aria-label="Audio Widgets Disabled Button"
        onClick={handleAudioHidden}
      />
    </div>
  );
}