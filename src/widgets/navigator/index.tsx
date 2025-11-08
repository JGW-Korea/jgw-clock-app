import { TABS } from "./model/tabs";
import "./styles/index.style.scss"
import TabNavItem from "./TabNavItem";

/**
 * -------------------------------------------
 * iOS Liquid Glass 스타일 기반 탭 네비게이션 컴포넌트
 * -------------------------------------------
*/
export default function BottomTabNavigator() {
  return (
    <footer>
      <nav className="tab-nav">
        <ul className="tab-nav__list">
          {/* ul 하위의 리스트 항목(탭 아이템)은 모든 구성이 동일하기 때문에 별도의 컴포넌트로 추출 후 합성 구조 유지 */}
          {TABS.map(({ id, path, label, icon }) => (
            <TabNavItem
              key={id}
              path={path}
              label={label}
              SvgIconComponent={icon}
            />
          ))}
        </ul>
      </nav>
    </footer>
  );
}