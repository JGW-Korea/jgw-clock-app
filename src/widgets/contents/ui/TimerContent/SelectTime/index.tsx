interface Props {
  label: string;
  styles: CSSModuleClasses;
}

export default function SelectTime({ label, styles }: Props) {
  return (
    <div className={`${styles["time-group__selector"]}`}>
      <button className={`${styles["decrement"]}`} />
      <span>{label}</span>
      <button className={`${styles["increment"]}`} />
    </div>
  );
}
