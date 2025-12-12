import styles from "./index.module.scss";

interface Props {
  padding?: number;
  children: React.ReactElement | React.ReactElement[];
}

export default function ListItem({ padding = 2, children }: Props) {
  return (
    <li
      className={`${styles["list-item"]}`}
      style={{
        padding: `${padding}rem 0`,
      }}
    >
      {children}
    </li>
  );
}
