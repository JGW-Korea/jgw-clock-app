import Layout from "@app/layout";
// import { AlarmPage } from "@pages/alarm";
import { StopwatchPage } from "@pages/stopwatch";
import { TimerPage } from "@pages/timer";
import { WorldPage } from "@pages/world";
import { Route, Routes } from "react-router";

/**
 * History API를 이용한 클라이언트 사이드 라우팅 하위의 URL과 1:1 매칭을 해주는 라우트 그룹 컴포넌트
*/
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<WorldPage />}  />
        {/* <Route path="/alarm" element={<AlarmPage />}  /> */}
        <Route path="/stopwatch" element={<StopwatchPage />}  />
        <Route path="/timer" element={<TimerPage />}  />  
      </Route>
    </Routes>
  );
}
