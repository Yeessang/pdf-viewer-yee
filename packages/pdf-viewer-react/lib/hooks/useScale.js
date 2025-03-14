import { useCallback, useEffect, useState } from "react";
import { PAGESCALE_ACTUAL, PAGESCALE_HEIGHT, PAGESCALE_WIDTH } from "../constants";
import { bindSize, debounce } from "@pdf-viewer-yee/core";

export function useScale(pdfInstance, pdfContainer) {
  const [pageScale, setPageScale] = useState(PAGESCALE_ACTUAL);
  const [currentScale, setCurrentScale] = useState(100);

  const inputScaleHandler = useCallback((e) => {
    const value = Number(e.target.value);
    if (value === 0) {
      setCurrentScale("");
    } else {
      setCurrentScale(value);
    }
  }, []);
  const keyupHandler = useCallback((e) => {
    if (e.keyCode === 13) {
      setPageScale(currentScale / 100);
    }
  }, [currentScale]);
  useEffect(() => {
    let sideEffectFn;
    if (pdfInstance.current) {
      pdfInstance.current.viewer.currentScaleValue = pageScale;
      if (pageScale === PAGESCALE_WIDTH || pageScale === PAGESCALE_HEIGHT) {
        const bindFn = debounce(() => {
          pdfInstance.current.viewer.currentScaleValue = pageScale;
        }, 100);
        sideEffectFn = bindSize(pdfContainer.current, bindFn);
      }
    }
    return () => {
      sideEffectFn?.();
    }
  }, [pageScale]);
  return {
    pageScale,
    currentScale,
    setCurrentScale,
    setPageScale,
    inputScaleHandler,
    keyupHandler
  }
}