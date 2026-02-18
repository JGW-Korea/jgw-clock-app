// import World from "@shared/assets/icons/world.svg?react";
// import Alarm from "@shared/assets/icons/alarm.svg?react";
// import Stopwatch from "@shared/assets/icons/stopwatch.svg?react";
// import Timer from "@shared/assets/icons/timer.svg?react";

import { lazy } from "react";

const WorldSVGComponent = lazy(() => import("@shared/assets/icons/world.svg?react"));
const AlarmSVGComponent = lazy(() => import("@shared/assets/icons/alarm.svg?react"));
const StopwatchSVGComponent = lazy(() => import("@shared/assets/icons/stopwatch.svg?react"));
const TimerSVGComponent = lazy(() => import("@shared/assets/icons/timer.svg?react"));

export const TABS: { id: number, path: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 1, path: "/", label: "World", icon: WorldSVGComponent },
  { id: 2, path: "/alarm", label: "Alarms", icon: AlarmSVGComponent },
  { id: 3, path: "/stopwatch", label: "Stopwatch", icon: StopwatchSVGComponent },
  { id: 4, path: "/timer", label: "Timers", icon: TimerSVGComponent },
];