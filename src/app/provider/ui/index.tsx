import { AlarmProvider } from "@entities/alarm";

export default function ClockProvider({ children }: { children: React.ReactElement }) {
  return (
    <AlarmProvider>
      {children}
    </AlarmProvider>
  );
}
