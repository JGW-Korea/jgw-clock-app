import styles from "./index.module.scss";

interface Props {
  id: number;
  active: boolean;
  onToggleActiveAlarm: (id: number) => void;
}

export default function ToggleSwitch({ id, active, onToggleActiveAlarm }: Props) {
  return (
    <div
      className={`${styles["switch"]} ${active ? styles["active"] : ""}`}
      onClick={() => onToggleActiveAlarm(id)}
    />
  )
}