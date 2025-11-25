import style from "./index.module.scss";

interface Props {
  show: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ show = false, onClick, children }: Props) {
  return (
    <>
      <div className={`${style["bottom-sheet__background"]} ${show ? style["show"] : ""}`} onClick={onClick}/>
      <div className={`${style["bottom-sheet__container"]} ${show ? style["show"] : ""}`}>
        {children}
      </div>
    </>
  )
}