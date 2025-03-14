import { useState, useEffect, useCallback } from 'react';
import { DRAWER_CATALOG, DRAWER_EMPTY, DRAWER_THUMBNAIL } from '../constants';


export function useDrawer(pdfInstance, currentPage) {
  const [drawerType, setDrawerType] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [catalogTreeData, setCatalogTreeData] = useState([]);
  useEffect(() => {
    if (drawerType === DRAWER_THUMBNAIL) {
      pdfInstance.current?.initThumbnailViewer();
      setTimeout(() => {
        pdfInstance.current?.thumbViewer?.scrollThumbnailIntoView(currentPage);
      });
    } else if (drawerType === DRAWER_CATALOG) {
      pdfInstance.current?.pdf?.getOutline().then(outline => {
        setCatalogTreeData(outline || []);
      });
    }
  }, [drawerType, currentPage]);
  const clickCatalog = useCallback((node) => {
    const dest = node.dest;
    pdfInstance.current?.link?.goToDestination(dest);
  }, []);
  const setDrawer = useCallback((type) => {
    if (type === DRAWER_EMPTY || type === drawerType) {
      setShowDrawer(false);
    } else {
      setShowDrawer(true);
    }
    setDrawerType(type);
  }, [drawerType]);
  return {
    drawerType,
    showDrawer,
    catalogTreeData,
    setCatalogTreeData,
    clickCatalog,
    setShowDrawer,
    setDrawerType,
    setDrawer
  }
}