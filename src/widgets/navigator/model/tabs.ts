import World from "@shared/assets/icons/world.svg?react";
import Alarm from "@shared/assets/icons/alarm.svg?react";
import Stopwatch from "@shared/assets/icons/stopwatch.svg?react";
import Timer from "@shared/assets/icons/timer.svg?react";

export const TABS: { id: number, path: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 1, path: "/", label: "World", icon: World },
  { id: 2, path: "/alarm", label: "Alarms", icon: Alarm },
  { id: 3, path: "/stopwatch", label: "Stopwatch", icon: Stopwatch },
  { id: 4, path: "/timer", label: "Timers", icon: Timer },
];