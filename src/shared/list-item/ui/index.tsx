import styles from "./index.module.scss";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  padding?: number;
  ref?: React.RefObject<HTMLLIElement | null>;
  children: React.ReactElement | React.ReactElement[];
}

export default function ListItem({ ref, className = "", style, padding = 2, children, ...props }: Props) {
  return (
    <li
    ref={ref}
    className={`${styles["list-item"]} ${className}`}
    style={{
      ...style,
      padding: `${padding}rem 0`,
    }}
    {...props}
    >
      {children}
    </li>
  );
}
