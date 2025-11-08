import Time from "../../../shared/assets/icons/time.svg?react";
import World from "../../../shared/assets/icons/world.svg?react";
import Stopwatch from "../../../shared/assets/icons/stopwatch.svg?react";
import Timer from "../../../shared/assets/icons/timer.svg?react";

export const TABS: { id: number, path: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 1, path: "/", label: "시계", icon: Time },
  { id: 2, path: "/world", label: "세계 시계", icon: World },
  { id: 3, path: "/stopwatch", label: "스톱워치", icon: Stopwatch },
  { id: 4, path: "/timer", label: "타이머", icon: Timer },
];