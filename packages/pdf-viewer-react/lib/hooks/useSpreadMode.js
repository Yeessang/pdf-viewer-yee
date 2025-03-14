import { useCallback, useState } from "react";
import { SPREADMODE_SIMPLE } from "../constants";

export function useSpreadMode(pdfInstance) {
  const [spreadMode, setSpreadMode] = useState(SPREADMODE_SIMPLE);

  const changeSpreadMode = useCallback((value) => {
    setSpreadMode(value);
    if (pdfInstance.current) {
      pdfInstance.current.viewer.spreadMode = value;
    }
  }, []);

  return {
    spreadMode,
    changeSpreadMode
  }
}