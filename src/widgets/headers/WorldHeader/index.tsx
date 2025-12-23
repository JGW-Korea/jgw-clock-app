import style from "./style.module.scss";
import PlusIcon from "@shared/assets/icons/plus.svg?react";
import Check from "@shared/assets/icons/check.svg?react";
import { Header } from "@shared/ui";

interface Props {
  worldTimeList: object[];
  editMode: { click: boolean; swipe: boolean };
  onClickEditModeActive: (type?: "click" | "swipe") => void;
  onClickOpenSheet: () => void;
}

/**
 * -------------------------------------
 * 세계 시계 페이지에서 사용되는 전용 헤더 컴포넌트
 * -------------------------------------
 * - 사용자가 등록한 세계 시계 유무에 따라 `편집` 버튼의 보여짐이 결정된다.
 */
export default function WorldHeader({ worldTimeList, editMode, onClickOpenSheet, onClickEditModeActive }: Props) {
  return (
    <Header title="World Clock">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Edit Button 활성화 버튼 */}
        <button
          className={`
            ${style["glass-button"]}
            ${style["glass-button__text"]} ${worldTimeList.length === 0 && style["glass-button__hidden"]}
          `}
          onClick={() => onClickEditModeActive("click")}
        >
          {(editMode.click || editMode.swipe) ? <Check /> : "Edit" }
        </button>
        
        {/* Bottom Sheet 활성화 버튼 */}
        <button className={`${style["glass-button"]} ${style["glass-button__icon"]}`} onClick={onClickOpenSheet}>
          <PlusIcon />
        </button>
      </div>
    </Header>
  );
}
