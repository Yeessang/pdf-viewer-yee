import { useCallback, useEffect, useState } from "react";
import { SCROLLMODE_VERTICAL } from "../constants";



export function useScrollMode(pdfInstance) {
  const [scrollMode, setScrollMode] = useState(SCROLLMODE_VERTICAL);

  const changeScrollMode = useCallback(() => {
    setScrollMode(scrollMode === 0 ? 1 : 0);
  }, [scrollMode]);

  useEffect(() => {
    if (pdfInstance.current) {
      pdfInstance.current.viewer.scrollMode = scrollMode
    }
  }, [scrollMode]);

  return {
    scrollMode,
    setScrollMode,
    changeScrollMode
  }
}