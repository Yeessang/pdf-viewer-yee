import { useState, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useDrawer } from './hooks/useDrawer';
import { useToolbar } from './hooks/useToolbar';
import { CSSTransition, Transition } from 'react-transition-group';
import { PDF } from '@pdf-viewer-yee/core';
import { 
  DRAWER_THUMBNAIL, 
  DRAWER_CATALOG, 
  DRAWER_EMPTY,
  PAGESCALE_ACTUAL,
  PAGESCALE_WIDTH,
  PAGESCALE_HEIGHT,
  SPREADMODE_DOUBLE,
  SPREADMODE_SIMPLE,
  SCROLLMODE_VERTICAL
} from './constants';
import PDFTree from './PDFTree';
import Mask from './Mask';
import { useScale } from './hooks/useScale';
import { usePage } from './hooks/usePage';
import { useSpreadMode } from './hooks/useSpreadMode';
import { useRotation } from './hooks/useRotation';
import { useScrollMode } from './hooks/useScrollMode';
import { useSearch } from './hooks/useSearch';
import { usePrint } from './hooks/usePrint';
import { useLoading } from './hooks/useLoading';
const EMPTY_FN = () => {}

export default function PDFViewer({ 
  theme = 'light',
  ref,
  style,
  renderOptions = {},
  onPagesLoaded = EMPTY_FN,
  onPageRendered = EMPTY_FN,
  onPageChanging = EMPTY_FN,
  onFindChange = EMPTY_FN,
  onScaleChanging = EMPTY_FN,
  onReady = EMPTY_FN,
}) {
  const drawerRef = useRef(null);
  const pdfWrapper = useRef(null);
  const pdfContainer = useRef(null);
  const thumbnailContainer = useRef(null);
  const pdfInstance = useRef(null);
  const config = useRef({});
  const topicVariable = useTheme(theme);
  const { 
    currentPage,
    totalPage,
    setTotalPage,
    setCurrentPage,
    pageChangeHandler,
    pageKeyUpHandler,
    pageBlurHandler,
  } = usePage(pdfInstance);
  const { 
    drawerType,
    showDrawer,
    catalogTreeData,
    clickCatalog,
    setShowDrawer,
    setCatalogTreeData,
    setDrawerType,
    setDrawer
  } = useDrawer(pdfInstance, currentPage);
  const { 
    showSmallMenu,
    smallMenu,
    menuFloatingRef,
    menuFloatXY,
    menuReference,
    toolbarTransitionStyles,
    toggleMenu
  } = useToolbar(pdfWrapper);
  const { 
    pageScale,
    currentScale,
    setCurrentScale, 
    setPageScale,
    inputScaleHandler,
    keyupHandler
  } = useScale(pdfInstance, pdfContainer);
  const { 
    spreadMode,
    changeSpreadMode
  } = useSpreadMode(pdfInstance);
  const {
    rotation,
    setRotation,
    changeRotation
  } = useRotation(pdfInstance);
  const {
    scrollMode,
    setScrollMode,
    changeScrollMode
  } = useScrollMode(pdfInstance);
  const {
    reference,
    floating,
    showSearch,
    searchIndex,
    searchTotal,
    searchKey,
    searchFloatXY,
    searchOptions,
    setSearchIndex,
    setSearchTotal,
    setSearchKey,
    toggleSearch,
    resetSearch,
    setShowSearch,
    findPrev,
    findNext,
    searchTransitionStyles,
    searchKeyUpHandler,
    toggleSearchOption
  } = useSearch(pdfInstance);
  const {
    showPrint,
    progress,
    print,
    abort
  } = usePrint(pdfInstance);
  const {
    loadingPercentVisible,
    setLoadingPercentVisible,
    loadingPercent,
    setLoadingPercent
  } = useLoading();
  const [renderKey, setRenderKey] = useState(1);
  
  useEffect(() => {
    if (!config.current.url && !config.current.data) return
    pdfInstance.current = new PDF({
      pdfContainer: pdfContainer.current,
      thumbnailContainer: thumbnailContainer.current,
      renderOptions: renderOptions,
      listeners: {
        onPagesLoaded: (v) => {
          setCurrentPage(1);
          setTotalPage(v.pagesCount);
          onPagesLoaded(v);
        },
        onPageRendered: (v) => {
          onPageRendered(v);
        },
        onPageChanging: (v) => {
          setCurrentPage(v.pageNumber);
          onPageChanging(v);
        },
        onFindChange: (v) => {
          setSearchIndex(v.matchesCount.current);
          setSearchTotal(v.matchesCount.total);
          onFindChange(v);
        },
        onLoadProgress: (v) => {
          setLoadingPercentVisible(v < 100);
          setLoadingPercent(v);
        },
        onScaleChanging: (v) => {
          setCurrentScale(parseInt(v.scale * 100))
          onScaleChanging(v);
        },
        onReady: () => {
          onReady();
        }
      }
    });
    pdfInstance.current.loadFile(config.current);
    return () => {
      pdfInstance.current?.destroy();
    }
  }, [renderKey]);
  useImperativeHandle(ref, () => {
    return {
      loadFile,
      changeSpreadMode,
      changeRotation,
      changeScrollMode,
      toggleSearch,
      setPageScale,
      setPage: (page) => {
        setCurrentPage(page);
        if (pdfInstance.current) {
          pdfInstance.current.viewer.currentPageNumber = page
        }
      }
    }
  });

  const loadFile = useCallback(function(data) {
    if (typeof data == 'string') {
      config.current.url = data
    } else {
      config.current.data = data
    }
    setRenderKey(renderKey + 1);
    setDrawer(DRAWER_EMPTY);
    setCatalogTreeData([]);
    setShowSearch(false);
    setCurrentPage(1);
    setTotalPage(0);
    setRotation(0);
    setScrollMode(0);
    setCurrentScale(100);
    setPageScale(PAGESCALE_ACTUAL);
  }, [renderKey])

  return (
    <section
      ref={pdfWrapper}
      className="pdf-wrapper"
      style={{...style, ...topicVariable}}
    >
      <section
        className="pdf-section"
        key={renderKey}
      >
        <div className="pdf-toolbar">
          <Transition
            nodeRef={menuFloatingRef}
            in={showSmallMenu}
            timeout={200}
          >
            {(state) => (
              <div
                ref={menuFloatingRef}
                className={smallMenu ? 'pdf-toolbar-container-small' : 'pdf-toolbar-container'}
                style={{ 
                  transformOrigin: `${menuFloatXY.x}px ${menuFloatXY.y}px`,
                  ...toolbarTransitionStyles[state]
                }}
              >
                <ul className="toolbar-group">
                  <li className={`toolbar-item ${drawerType === DRAWER_THUMBNAIL ? 'toolbar-item-active' : ''}`} onClick={() => setDrawer(DRAWER_THUMBNAIL)}>
                    <i className="icon iconfont icon-xiaosuolvetu"></i>
                    <span>缩略图</span>
                  </li>
                  <li className={`toolbar-item ${drawerType === DRAWER_CATALOG ? 'toolbar-item-active' : ''}`} onClick={() => setDrawer(DRAWER_CATALOG)}>
                    <i className="icon iconfont icon-mulu"></i>
                    <span>目录</span>
                  </li>
                </ul>
                <ul className="toolbar-group">
                  <li className={`toolbar-item ${pageScale === PAGESCALE_ACTUAL ? 'toolbar-item-active' : ''}`} onClick={() => setPageScale(PAGESCALE_ACTUAL)}>
                    <i className="icon iconfont icon-yuanchicun"></i>
                    <span>原尺寸</span>
                  </li>
                  <li className={`toolbar-item ${pageScale === PAGESCALE_WIDTH ? 'toolbar-item-active' : ''}`} onClick={() => setPageScale(PAGESCALE_WIDTH)}>
                    <i className="icon iconfont icon-zishiyingkuandu"></i>
                    <span>适应宽度</span>
                  </li>
                  <li className="toolbar-page">
                    <input
                      type="number" 
                      className="pdf-input" 
                      max="40" 
                      min="1" 
                      value={currentScale} 
                      onChange={inputScaleHandler}
                      onKeyUp={keyupHandler}
                    />
                    <span className="toolbar-page-percent">%</span>
                  </li>
                  <li className={`toolbar-item ${pageScale === PAGESCALE_HEIGHT ? 'toolbar-item-active' : ''}`} onClick={() => setPageScale(PAGESCALE_HEIGHT)}>
                    <i className="icon iconfont icon-zishiyinggaodu"></i>
                    <span>适应高度</span>
                  </li>
                  { 
                    !smallMenu 
                    && 
                    <li className="toolbar-page">
                      <input
                        type="number" 
                        className="pdf-input"
                        value={currentPage} 
                        onChange={pageChangeHandler}
                        onKeyUp={pageKeyUpHandler}
                        onBlur={pageBlurHandler}
                      />
                      <span className="pdf-input-gap">/</span>
                      <input
                        type="number" 
                        className="pdf-input" 
                        value={totalPage}
                        disabled
                      />
                    </li>
                  }
                  <li className={`toolbar-item ${spreadMode === SPREADMODE_SIMPLE ? 'toolbar-item-active' : ''}`} onClick={() => changeSpreadMode(SPREADMODE_SIMPLE)}>
                    <i className="icon iconfont icon-danyeshitu"></i>
                    <span>单页视图</span>
                  </li>
                  <li className={`toolbar-item ${spreadMode === SPREADMODE_DOUBLE  ? 'toolbar-item-active' : ''}`} onClick={() => changeSpreadMode(SPREADMODE_DOUBLE)}>
                    <i className="icon iconfont icon-shuangyeshitu"></i>
                    <span>双页视图</span>
                  </li>
                  <li className={`toolbar-item ${(rotation % 360 !== 0) ? 'toolbar-item-active' : ''}`} onClick={changeRotation}>
                    <i className="icon iconfont icon-rotate" style={{ transform: `rotate(${rotation}deg)` }}></i>
                    <span>旋转</span>
                  </li>
                  <li className="toolbar-item toolbar-item-active" onClick={changeScrollMode}>
                    <i className={`icon iconfont icon-hengxianggundong1 ${scrollMode === SCROLLMODE_VERTICAL ? 'pdf-rotate-90' : ''}`}></i>
                    <span>{ scrollMode === SCROLLMODE_VERTICAL ? '竖向滚动' : '横向滚动' }</span>
                  </li>
                </ul>
                <ul className="toolbar-group">
                  <li className={`toolbar-item ${showSearch ? 'toolbar-item-active' : ''}`} ref={reference} onClick={toggleSearch}>
                    <i className="icon iconfont icon-chaxun"></i>
                    <span>查询</span>
                  </li>
                  <li className="toolbar-item" onClick={print}>
                    <i className="icon iconfont icon-dayinji_o"></i>
                    <span>打印</span>
                  </li>
                </ul>
              </div>
            )}
            
          </Transition>
          { 
            smallMenu
            && 
            <div
              className="toolbar-page pdf-small-menu"
            >
              <input
                type="number" 
                className="pdf-input" 
                value={currentPage} 
                onChange={pageChangeHandler}
                onKeyUp={pageKeyUpHandler}
                onBlur={pageBlurHandler}
              />
              <span className="pdf-input-gap">/</span>
              <input
                type="number" 
                className="pdf-input" 
                value={totalPage}
                disabled
              />
            </div>
          }
          { 
            smallMenu
            &&
            <div className={`pdf-menu-setting toolbar-item ${showSmallMenu ? 'toolbar-item-active' : ''}`} ref={menuReference} onClick={toggleMenu}>
              <div className={`menu-group-setting ${showSmallMenu ? 'menu-group-setting-active' : ''}`}></div>
            </div>
          }
          
        </div>
        <div className="pdf-drawer">
          <CSSTransition
            nodeRef={drawerRef}
            in={showDrawer}
            timeout={200}
            classNames="transform"
            onExited={() => {
              setDrawerType(DRAWER_EMPTY)
            }}
          >
            <div className="pdf-thumbnail" ref={drawerRef} style={{ width: drawerType === DRAWER_EMPTY ? '0' : '200px' }}>
              <PDFTree
                style={{ display: drawerType === DRAWER_CATALOG ? 'block' : 'none' }}
                treeData={catalogTreeData}
                nodeKey="title"
                onNodeClick={clickCatalog}
              ></PDFTree>
              <div
                style={{ display: drawerType === DRAWER_THUMBNAIL ? 'block' : 'none' }}
                className="pdf-thumbnail-container" 
                ref={thumbnailContainer} 
              ></div>
            </div>
          </CSSTransition>
          <div className="pdf-main">
            <div
              ref={pdfContainer}
              className="pdf-container pdf-main-content"
            >
              <div className="pdfViewer"></div>
            </div>
          </div>
        </div>
        <Transition
          in={showSearch}
          timeout={200}
          nodeRef={floating}
        >
          {(state) => (
            <div
              ref={floating} 
              className="pdf-search-wrapper"
              style={{ 
                transformOrigin: `${searchFloatXY.x}px ${searchFloatXY.y}px`,
                ...searchTransitionStyles[state]
              }}
            >
              <div className="pdf-search-operate">
                <input 
                  type="text" 
                  className="pdf-search-input"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  onKeyUp={searchKeyUpHandler}
                />
                <i className="icon iconfont icon-jiantou_xiangshang pdf-search-toggle" onClick={findPrev}></i>
                <i className="icon iconfont icon-jiantou_xiangxia pdf-search-toggle" onClick={findNext}></i>
              </div>
              <div className="pdf-search-type">
                <div className={`pdf-search-option ${searchOptions.highlightAll ? 'toolbar-item-active' : ''}`} onClick={() => toggleSearchOption('highlightAll')}>全部高亮显示</div>
                <div className={`pdf-search-option pdf-ml-1 ${searchOptions.caseSensitive ? 'toolbar-item-active' : ''}`} onClick={() => toggleSearchOption('caseSensitive')}>区分大小写</div>
                <div className={`pdf-search-option ${searchOptions.matchDiacritics ? 'toolbar-item-active' : ''}`} onClick={() => toggleSearchOption('matchDiacritics')}>匹配变音符号</div>
                <div className={`pdf-search-option pdf-ml-1 ${searchOptions.entireWord ? 'toolbar-item-active' : ''}`} onClick={() => toggleSearchOption('entireWord')}>全词匹配</div>
              </div>
              { 
                searchTotal > 0 
                &&
                <div className="pdf-search-statis">
                  第{ searchIndex }项，共{ searchTotal }项
                </div>
              }
            </div>
          )}
          
        </Transition>
        {
          showPrint
          && 
          <Mask
            progress={progress}
          >
            <>
              <div className="pdf-mask-tip">
                准备打印文档中，当前进度：{ progress }%
              </div>
              <div className="pdf-mask-footer">
                <button className="pdf-mask-btn" onClick={abort}>取消打印</button>
              </div>
            </>
          </Mask>
        }
        {
          loadingPercentVisible
          && 
          <Mask
            progress={loadingPercent}
          >
            <div className="pdf-mask-tip">
              准备加载文档中，当前进度：{ loadingPercent }%
            </div>
          </Mask>
        }
      </section>
    </section>
  )
}