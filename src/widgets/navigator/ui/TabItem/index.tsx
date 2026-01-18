import { NavLink } from "react-router";

interface Props {
  SvgIconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  label: string;
  styles: CSSModuleClasses;
}

export default function TabItem({ SvgIconComponent, path, label, styles }: Props) {
  return (
    <li className={`${styles["tab-nav__item"]}`}>
      <NavLink to={path} className={`${styles["tab-nav__link"]}`}>
        <SvgIconComponent className={`${styles["tab-nav__link-icon"]}`} />
        <span className={`${styles["tab-nav__link-text"]}`}>{label}</span>
      </NavLink>
    </li>
  );
}
