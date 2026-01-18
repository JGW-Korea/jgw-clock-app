import { TABS } from "../model/tabs";
import TabItem from "./TabItem";
import styles from "./index.module.scss";

/**
 * -------------------------------------------
 * iOS Liquid Glass 스타일 기반 탭 네비게이션 컴포넌트
 * -------------------------------------------
*/
export default function TabNavigator() {
  return (
    <footer>
      <nav className={`${styles["tab-nav"]}`}>
        <ul className={`${styles["tab-nav__list"]}`}>
          {/* ul 하위의 리스트 항목(탭 아이템)은 모든 구성이 동일하기 때문에 별도의 컴포넌트로 추출 후 합성 구조 유지 */}
          {TABS.map(({ id, path, label, icon }) => (
            <TabItem
              key={id}
              path={path}
              label={label}
              SvgIconComponent={icon}
              styles={styles}
            />
          ))}
        </ul>
      </nav>
    </footer>
  );
}