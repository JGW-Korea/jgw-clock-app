import type { TimeUnit } from "../../model";

interface Props {
  label: TimeUnit;
  styles: CSSModuleClasses;
  decrementDisabled: boolean;
  incrementDisabled: boolean;
  increment: (type: TimeUnit) => void;
  decrement: (type: TimeUnit) => void;
}

export default function TimerSelector({ label, styles, decrementDisabled, incrementDisabled, increment, decrement }: Props) {
  return (
    <div className={`${styles["time-group__selector"]}`}>
      <button className={`${styles["decrement"]}`} disabled={decrementDisabled} onClick={() => decrement(label)} />
      <span>{label}</span>
      <button className={`${styles["increment"]}`} disabled={incrementDisabled} onClick={() => increment(label)} />
    </div>
  );
}
