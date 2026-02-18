import styles from "./index.module.scss";
import { Outlet } from "react-router";
import { TabNavigator } from "@widgets/navigator";

/**
 * 선언형 React Router에서 모든 라우트 간 공통적으로 사용되는 Layout 컴포넌트
*/
export default function Layout() {
  return (
    <>
      <div className={`${styles["layout"]}`}>
        <div className={`${styles["layout-content"]}`}>
          <Outlet />
        </div>

        <TabNavigator />
      </div>
    </>
  );
}
