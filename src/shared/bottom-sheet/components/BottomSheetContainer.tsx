import style from "../styles/bottomSheetContainer.module.scss";

interface Props {
  show: boolean;
  children: React.ReactNode;
}

/**
 * -------------------------------
 * 전역 Bottom Sheet 컨테이너 컴포넌트
 * -------------------------------
 * - 전달받는 속성의 종류는 show(보여짐 여부), children를 전달받는다.
*/
export default function BottomSheetContainer({ show, children }: Props) {
  return (
    <div className={`${style["bottom-sheet__container"]} ${show ? style["show"] : ""}`}>
      {children}
    </div>
  );
}
