import type { TimerState } from "../useTimer";

interface Props {
  label: keyof TimerState;
  styles: CSSModuleClasses;
  decrementDisabled: boolean;
  incrementDisabled: boolean;
  increment: (type: keyof TimerState) => void;
  decrement: (type: keyof TimerState) => void;
}

export default function SelectTime({ label, styles, decrementDisabled, incrementDisabled, increment, decrement }: Props) {
  return (
    <div className={`${styles["time-group__selector"]}`}>
      <button className={`${styles["decrement"]}`} disabled={decrementDisabled} onClick={() => decrement(label)} />
      <span>{label}</span>
      <button className={`${styles["increment"]}`} disabled={incrementDisabled} onClick={() => increment(label)} />
    </div>
  );
}
