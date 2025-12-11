import { Outlet } from "react-router";
import styles from "./index.module.scss";
import { TabNavigator } from "../../../widgets/navigator";

export default function Layout() {
  return (
    <div className={`${styles["layout"]}`}>
      <div className={`${styles["layout-content"]}`}>
        <Outlet />
      </div>

      <TabNavigator />
    </div>
  );
}
