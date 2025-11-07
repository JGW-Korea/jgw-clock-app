import { Outlet } from "react-router";
import "./index.style.scss";
import BottomTabNavigator from "../../../widgets/navigator";

export default function Layout() {
  return (
    <div className="layout">
      <div className="content">
        <Outlet />
      </div>

      <BottomTabNavigator />
    </div>
  );
}
