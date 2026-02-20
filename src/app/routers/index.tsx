import { Route, Routes } from "react-router";
import Layout from "@app/layout";
import { lazy } from "react";
import { WorldPage } from "@pages/world";
// import { AlarmPage } from "@pages/alarm";
// import { StopwatchPage } from "@pages/stopwatch";
// import { TimerPage } from "@pages/timer";

// const WorldPage = lazy(() => import("@pages/world").then((module) => ({ default: module.WorldPage })));
const AlarmPage = lazy(() => import("@pages/alarm").then((module) => ({ default: module.AlarmPage })));
const StopwatchPage = lazy(() => import("@pages/stopwatch").then((module) => ({ default: module.StopwatchPage })));
const TimerPage = lazy(() => import("@pages/timer").then((module) => ({ default: module.TimerPage })));

/**
 * History API를 이용한 클라이언트 사이드 라우팅 하위의 URL과 1:1 매칭을 해주는 라우트 그룹 컴포넌트
*/
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<WorldPage />}  />
        <Route path="/alarm" element={<AlarmPage />}  />
        <Route path="/stopwatch" element={<StopwatchPage />}  />
        <Route path="/timer" element={<TimerPage />}  />  
      </Route>
    </Routes>
  );
}
