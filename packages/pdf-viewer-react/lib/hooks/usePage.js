import { useCallback, useState } from "react";


export function usePage(pdfInstance) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  
  const pageChangeHandler = useCallback((e) => {
    let value = Number(e.target.value);
    value = Math.min(Math.max(1, value), totalPage);
    setCurrentPage(value);
  });

  const pageKeyUpHandler = useCallback((e) => {
    if (e.keyCode === 13 && pdfInstance.current) {
      pdfInstance.current.viewer.currentPageNumber = currentPage
    }
  }, [currentPage]);
  const pageBlurHandler = useCallback(() => {
    if (pdfInstance.current) {
      pdfInstance.current.viewer.currentPageNumber = currentPage
    }
  }, [currentPage])

  return {
    currentPage,
    totalPage,
    setTotalPage,
    setCurrentPage,
    pageChangeHandler,
    pageKeyUpHandler,
    pageBlurHandler,
  }
}