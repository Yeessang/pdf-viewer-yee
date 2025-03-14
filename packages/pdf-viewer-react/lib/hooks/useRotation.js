import { useCallback, useEffect, useState } from "react";



export function useRotation(pdfInstance) {
  const [rotation, setRotation] = useState(0);

  const changeRotation = useCallback(() => {
    setRotation(rotation + 90);
  }, [rotation]);

  useEffect(() => {
    if (pdfInstance.current) {
      pdfInstance.current.viewer.pagesRotation = rotation;
    }
  }, [rotation])

  return {
    rotation,
    setRotation,
    changeRotation
  }
}