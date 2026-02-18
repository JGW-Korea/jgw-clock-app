import WorldSVGComponent from "@shared/assets/icons/world.svg?react";
import AlarmSVGComponent from "@shared/assets/icons/alarm.svg?react";
import StopwatchSVGComponent from "@shared/assets/icons/stopwatch.svg?react";
import TimerSVGComponent from "@shared/assets/icons/timer.svg?react";

export const TABS: { id: number, path: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 1, path: "/", label: "World", icon: WorldSVGComponent },
  { id: 2, path: "/alarm", label: "Alarms", icon: AlarmSVGComponent },
  { id: 3, path: "/stopwatch", label: "Stopwatch", icon: StopwatchSVGComponent },
  { id: 4, path: "/timer", label: "Timers", icon: TimerSVGComponent },
];