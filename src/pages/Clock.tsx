import { useRef } from "react";
import Header from "../shared/header";

import "./clock.style.scss"

export default function Clock() {
  const switchButton = useRef<HTMLDivElement>(null);
  const switchBtnRight = useRef<HTMLButtonElement>(null);
  const switchBtnLeft = useRef<HTMLButtonElement>(null);
  const activeSwitch = useRef<HTMLSpanElement>(null);
  
  const switchLeft = () => {
    if(!switchBtnLeft.current || !switchBtnRight.current || !activeSwitch.current) return;

    switchBtnRight.current.classList.remove("active-case");
    switchBtnLeft.current.classList.add("active-case");
    activeSwitch.current.style.left = "0%";
  }

  const switchRight = () => {
    if(!switchBtnLeft.current || !switchBtnRight.current || !activeSwitch.current) return;

    switchBtnRight.current.classList.add("active-case");
    switchBtnLeft.current.classList.remove("active-case");
    activeSwitch.current.style.left = "50%";
  }

  return (
    <>
      <Header>
        <h1>
          현재 시간
        </h1>
        <div className="switch-container">
          <div ref={switchButton} className="switch-button">
            <span ref={activeSwitch} className="active" />
            <button ref={switchBtnLeft} className="switch-button-case left active-case" onClick={switchLeft}>12h</button>
            <button ref={switchBtnRight} className="switch-button-case right" onClick={switchRight}>24h</button>
          </div>
        </div>
      </Header>
    </>
  );
}
