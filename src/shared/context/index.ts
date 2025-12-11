import { createContext } from "react";
import type { ClockContextType } from "./types";

/** 전역에서 상태를 공유하기 위한 Context 객체 */
export const ClockContext = createContext<ClockContextType | null>(null);