import { useRef, useState } from "react";



export function usePrint(pdfInstance) {
  const [showPrint, setShowPrint] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortPrint = useRef();

  async function print() {
    if (!pdfInstance.current) return
    setShowPrint(true);
    setProgress(0);
    const { abort } = await pdfInstance.current?.printPDF(
      v => setProgress(v),
      () => setShowPrint(false)
    );
    abortPrint.current = abort;
  }


  function abort() {
    abortPrint.current?.();
  }

  return {
    showPrint,
    progress,
    print,
    abort
  }
}