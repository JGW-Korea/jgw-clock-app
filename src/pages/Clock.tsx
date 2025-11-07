import { useState } from "react";
import { ClockHeader } from "../widgets/headers";

export default function Clock() {
  const [mode, setMode] = useState<boolean>(false);
  
  const handleChangeMode = () => {
    setMode((prev) => !prev);
  }

  return (
    <>
      <ClockHeader mode={mode} onClick={handleChangeMode} />
    </>
  );
}
