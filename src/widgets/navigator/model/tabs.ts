import Time from "../../../shared/assets/icons/time.svg?react";
import World from "../../../shared/assets/icons/world.svg?react";
import Stopwatch from "../../../shared/assets/icons/stopwatch.svg?react";
import Timer from "../../../shared/assets/icons/timer.svg?react";

export const TABS: { id: number, path: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 1, path: "/", label: "World Clock", icon: Time },
  { id: 2, path: "/world", label: "Alarms", icon: World },
  { id: 3, path: "/stopwatch", label: "Stopwatch", icon: Stopwatch },
  { id: 4, path: "/timer", label: "Timers", icon: Timer },
];