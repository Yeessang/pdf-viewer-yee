import { useCallback, useEffect, useRef, useState } from "react";
import { useImmer } from 'use-immer';
import { computePosition, flip, shift, size } from "@floating-ui/dom";
import { debounce } from "@pdf-viewer-yee/core";

const searchTransitionStyles = {
  entering: { opacity: 0, transform: 'scale(0)' }, // 进入中
  entered: { opacity: 1, transform: 'scale(1)' },  // 进入完成
  exiting: { opacity: 1, transform: 'scale(1)' },  // 退出中
  exited: { opacity: 0, transform: 'scale(0)' }, // 退出完成
};
export function useSearch(pdfInstance) {
  const reference = useRef();
  const floating = useRef();
  const [showSearch, setShowSearch] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [searchFloatXY, updateSearchFloatXY] = useImmer({
    x: 0,
    y: 0
  });
  const [searchOptions, updateSearchOptions] = useImmer({
    highlightAll: false, // 所有找到的都渲染
    matchDiacritics: false, // 匹配变音符号
    caseSensitive: false, // 区分大小写
    entireWord: false // 全词匹配
  });

  const findPrev = useCallback(() => {
    pdfInstance.current?.findPrev(searchKey, searchOptions);
  }, [searchKey, searchOptions]);

  const findNext = useCallback(() => {
    pdfInstance.current?.findNext(searchKey, searchOptions);
  }, [searchKey, searchOptions]);

  const searchKeyUpHandler = useCallback((e) => {
    if (e.keyCode === 13) {
      findNext()
    }
  }, [searchKey, searchOptions]);

  const toggleSearchOption = useCallback((key) => {
    updateSearchOptions(draft => {
      draft[key] = !draft[key]
    })
    if (!searchKey) return
    if (key !== 'highlightAll') {
      setSearchIndex(0);
      setSearchTotal(0);
    }
  }, [searchKey, searchOptions])
    

  function resetSearch() {
    setSearchKey("");
    setSearchIndex(0);
    setSearchTotal(0);
  }
  function toggleSearch() {
    setShowSearch(!showSearch);
  }

  useEffect(() => {
    if (showSearch) {
      computePosition(reference.current, floating.current, {
        placement: "bottom",
        middleware: [flip(), shift()]
      }).then(({ x, y, placement }) => {
        if (placement.includes("bottom")) {
          updateSearchFloatXY(draft => {
            draft.x = 120
            draft.y = -10
          });
        } else if (placement.includes("top")) {
          updateSearchFloatXY(draft => {
            draft.x = 120
            draft.y = floating.current.offsetHeight + 10
          });
        }
        Object.assign(floating.current.style, {
          top: `${y}px`,
          left: `${x - 3}px`
        });
      });
    } else {
      resetSearch();
    }
  }, [showSearch]);


  const _search = useCallback((value, options) => {
    pdfInstance.current?.find(value, options);
  }, []);

  const inputSearch = useCallback(debounce(_search, 100), []);

  useEffect(() => {
    inputSearch(searchKey, searchOptions);
  }, [searchKey, searchOptions]);
  


  return {
    reference,
    floating,
    showSearch,
    searchIndex,
    searchTotal,
    searchKey,
    searchFloatXY,
    searchOptions,
    updateSearchOptions,
    setShowSearch,
    setSearchIndex,
    setSearchTotal,
    setSearchKey,
    toggleSearch,
    resetSearch,
    findPrev,
    findNext,
    searchTransitionStyles,
    searchKeyUpHandler,
    toggleSearchOption
  }
}