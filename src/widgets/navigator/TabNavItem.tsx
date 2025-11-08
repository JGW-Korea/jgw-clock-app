import { NavLink } from "react-router";

interface Props {
  SvgIconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  label: string;
}

export default function TabNavItem({ SvgIconComponent, path, label }: Props) {
  return (
    <li className="tab-nav__item">
      <NavLink to={path} className="tab-nav__link">
        <SvgIconComponent className="tab-nav__link-icon" />
        <span className="tab-nav__link-text">{label}</span>
      </NavLink>
    </li>
  );
}
