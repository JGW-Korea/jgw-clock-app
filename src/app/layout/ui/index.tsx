import { Outlet } from "react-router";
import styles from "./index.module.scss";
import { TabNavigator } from "../../../widgets/navigator";
import { useAudioControl } from "../model";
import { Audio } from "../../../widgets/audio";

export default function Layout() {
  const { audioRef, enable, audioType, handleAudioHidden } = useAudioControl();

  return (
    <>
      {enable && <Audio ref={audioRef} type={audioType} onClick={handleAudioHidden} /> }
      
      <div className={`${styles["layout"]}`}>
        <div className={`${styles["layout-content"]}`}>
          <Outlet />
        </div>

        <TabNavigator />
      </div>
    </>
  );
}
