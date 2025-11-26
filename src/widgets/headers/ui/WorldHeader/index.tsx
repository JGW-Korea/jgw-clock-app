import style from "./style.module.scss";
import Header from "../../../../shared/header";
import PlusIcon from "../../../../shared/assets/icons/plus.svg?react"

interface Props {
  worldTimeList: object[]
  onClick: () => void;
}

/**
 * -------------------------------------
 * 세계 시계 페이지에서 사용되는 전용 헤더 컴포넌트
 * -------------------------------------
 * - 사용자가 등록한 세계 시계 유무에 따라 `편집` 버튼의 보여짐이 결정된다.
*/
export default function WorldHeader({ worldTimeList, onClick }: Props) {
  return (
    <Header title="World Clock">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className={`${style["glass-button"]} ${style["glass-button__text"]} ${worldTimeList.length === 0 && style["glass-button__hidden"]}`}>
          Edit
        </button>
        <button className={`${style["glass-button"]} ${style["glass-button__icon"]}`} onClick={onClick}>
          <PlusIcon />
        </button>
      </div>
    </Header>
  );
}
