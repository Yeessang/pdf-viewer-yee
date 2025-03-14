import { useState, useRef, useEffect, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { bindSize } from '@pdf-viewer-yee/core';
import { computePosition, size, shift, flip } from '@floating-ui/dom';
const initMenuFloat = {
  x: 0,
  y: 0
}
const toolbarTransitionStyles = {
  entering: { opacity: 0, transform: 'scale(0)' }, // 进入中
  entered: { opacity: 1, transform: 'scale(1)' },  // 进入完成
  exiting: { opacity: 1, transform: 'scale(1)' },  // 退出中
  exited: { opacity: 0, transform: 'scale(0)' }, // 退出完成
};

export function useToolbar(pdfWrapper) {
  const [showSmallMenu, setShowSmallMenu] = useState(false);
  const [smallMenu, setSmallMenu] = useState(false);
  const menuFloatingRef = useRef(null);
  const [menuFloatXY, updateMenuFloatXY] = useImmer(initMenuFloat)
  const menuReference = useRef(null);

  useEffect(() => {
    const unbindSize = bindSize(pdfWrapper.current, () => {
      const wrapper = pdfWrapper.current
      const isSmallMenu = wrapper.clientWidth < 700
      setShowSmallMenu(!isSmallMenu)
      setSmallMenu(isSmallMenu)
      if (isSmallMenu && menuFloatingRef.current) {
        menuFloatingRef.current.style.display = 'none'
        setTimeout(() => {
          menuFloatingRef.current.style.display = 'flex'
        }, 210)
      }
    })
    return () => {
      unbindSize();
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setShowSmallMenu(!showSmallMenu);
  }, [showSmallMenu]);

  useEffect(() => {
    if (showSmallMenu && smallMenu) {
      computePosition(menuReference.current, menuFloatingRef.current, {
        placement: "bottom",
        middleware: [flip(), shift(), size({
          apply({availableHeight, elements}) {
            Object.assign(elements.floating.style, {
              maxHeight: `${Math.max(100, availableHeight - 15)}px`,
              overflowY: 'auto'
            });
          },
        })]
      }).then(({ x, y, placement }) => {
        if (placement.includes("bottom")) {
          updateMenuFloatXY(draft => {
            draft.x = x / 2;
            draft.y = 10;
          })
        } else if (placement.includes("top")) {
          updateMenuFloatXY(draft => {
            draft.x = x / 2;
            draft.y = menuFloatingRef.current.offsetHeight + 10;
          })
        }
        Object.assign(menuFloatingRef.current.style, {
          top: `${y + 10}px`,
          left: `${x - 3}px`
        });
      });
    }
  }, [showSmallMenu, smallMenu]);
  
  return {
    showSmallMenu,
    smallMenu,
    menuFloatingRef,
    menuFloatXY,
    menuReference,
    toggleMenu,
    setShowSmallMenu,
    setSmallMenu,
    toolbarTransitionStyles
  }
}