import style from "../styles/bottomSheetBackground.module.scss";

interface Props {
  show: boolean;
  onBackgroundClick: () => void;
}

/**
 * -------------------------------
 * 전역 Bottom Sheet 뒷배경 컴포넌트
 * -------------------------------
 * - 전달받는 속성의 종류는 show(보여짐 여부), onBackgroundClick(Bottom Sheet 뒷 배경 클릭 시 Bottom Sheet를 닫는 용도)를 전달받는다.
*/
export default function BottomSheetBackground({ show, onBackgroundClick }: Props) {
  return (
    <div className={`${style["bottom-sheet__background"]} ${show ? style["show"] : ""}`} onClick={onBackgroundClick}/>
  );
}
