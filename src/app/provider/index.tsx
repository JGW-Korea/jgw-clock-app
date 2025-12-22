import { AlarmProvider } from "@entities/alarm";

/**
 * 전역으로 공유해야 되는 상태에 대한 Provider들을 조합하는 최상위 Provider 컴포넌트
*/
export default function AppProvider({ children }: { children: React.ReactElement | React.ReactElement[] }) {
  return (
    <AlarmProvider>
      {children}
    </AlarmProvider>
  );
}
