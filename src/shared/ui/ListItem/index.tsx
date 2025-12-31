import styles from "./index.module.scss";

export interface Props {
  ref?: React.RefObject<HTMLLIElement | null>;
  className?: string;
  style?: React.CSSProperties;
  padding?: number;
  children: React.ReactElement | React.ReactElement[];
}

export default function ListItem({ ref, className = "", style, padding = 2, children }: Props) {
  return (
    <li
      ref={ref}
      className={`${styles["list-item"]} ${className}`}
      style={{
        ...style,
        padding: `${padding}rem 0`,
      }}
    >
      {children}
    </li>
  );
}
