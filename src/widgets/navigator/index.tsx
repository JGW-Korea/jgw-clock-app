import { NavLink } from "react-router";
import "./styles/index.style.scss"

import Time from "../../shared/assets/icons/time.svg?react";
import World from "../../shared/assets/icons/world.svg?react";
import Stopwatch from "../../shared/assets/icons/stopwatch.svg?react";
import Timer from "../../shared/assets/icons/timer.svg?react";

export default function BottomTabNavigator() {
  return (
    <footer>
      <nav className="tab-nav">
        <ul className="tab-nav__list">
          <li className="tab-nav__item">
            <NavLink to="/" className="tab-nav__link">
              <Time className="tab-nav__link-icon"/>
              <span className="tab-nav__link-text">시계</span>
            </NavLink>
          </li>
          <li className="tab-nav__item">
            <NavLink to="/world" className="tab-nav__link">
              <World className="tab-nav__link-icon"/>
              <span className="tab-nav__link-text">세계 시계</span>
            </NavLink>
          </li>
          <li className="tab-nav__item">
            <NavLink to="/stopwatch" className="tab-nav__link">
              <Stopwatch className="tab-nav__link-icon"/>
              <span className="tab-nav__link-text">스톱워치</span>
            </NavLink>
          </li>
          <li className="tab-nav__item">
            <NavLink to="/timer" className="tab-nav__link">
              <Timer className="tab-nav__link-icon"/>
              <span className="tab-nav__link-text">타이머</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
}