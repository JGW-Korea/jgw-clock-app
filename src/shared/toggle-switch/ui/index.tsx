import styles from "./index.module.scss";

interface Props {
  active: boolean;
  onClick: () => void;
}

export default function ToggleSwitch({ active, onClick }: Props) {
  return (
    <div
      className={`${styles["switch"]} ${active ? styles["active"] : ""}`}
      onClick={onClick}
    />
  )
}