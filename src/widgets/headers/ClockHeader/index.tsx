import Header from "../../../shared/header";
import "./index.style.scss"

interface Props {
  mode: boolean;
  onClick: () => void;
}

export default function ClockHeader({ mode, onClick }: Props) {
  
  return (
    <Header title="Current Time">
      <div className="switch-button" onClick={onClick}>
        <span className="active" style={{ left: !mode ? "0%" : "50%" }} />
        <button className={`switch-button-case left ${!mode && 'active-case'}`}>12h</button>
        <button className={`switch-button-case right ${mode && 'active-case'}`}>24h</button>
      </div>
    </Header>
  );
}
