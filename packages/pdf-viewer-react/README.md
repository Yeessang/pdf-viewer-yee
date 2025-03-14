# @pdf-viewer-yee/pdf-viewer-react

一款React框架开发的pdf阅读器组件，如果您使用的是Vue2，可以查看[Vue2PDF阅读器组件地址](https://www.npmjs.com/package/@pdf-viewer-yee/pdf-viewer-vue2)，如果您使用的是Vue3，可以查看[Vue3PDF阅读器组件地址](https://www.npmjs.com/package/@pdf-viewer-yee/pdf-viewer-vue3)


## demo

[demo地址](https://codesandbox.io/p/devbox/p8gpcr?file=%2Fsrc%2FApp.jsx%3A2%2C52)

## feature

- 文本选中、复制
- 缩略图
- 目录
- 翻页、跳转页
- 单页/双页视图
- 缩放/容器宽/容器高/原尺寸/自定义尺寸
- 打印
- 搜索文本
- 旋转
- 横向/竖向滚动
- 移动端
- 深色、浅色主题
- 自定义主题(变量文档待更新)

## usage
```js
npm install @pdf-viewer-yee/pdf-viewer-react
```


```js
import { useState, useRef, useEffect, useCallback } from "react";
import PDF from "@pdf-viewer-yee/pdf-viewer-react";
import "@pdf-viewer-yee/pdf-viewer-react/dist/pdf-viewer-react.css";
const customOptions = {
  // pageColors: {
  //   background: '#222', // 自定义页面背景
  //   foreground: '#EBEBEB', // 自定义文字颜色，不包括图片等
  // },
  // textLayerMode: 1, // 0 是禁用文字 1 是显示文字 2 启动svg文本层
  // enablePrintAutoRotate 是否在打印时自动旋转，这里不支持
  // removePageBorders 是否移除页面边框
  // maxCanvasPixels 设置canvas的最大像素数，设置为0是无限制
  // enablePermissions 是否启用PDF的权限检查
  // 还有全屏等配置，未来会直接在阅读器组件中支持
};
function App() {
  const [theme, setTheme] = useState("light");
  const pdfComp = useRef(null);
  const pdfMobileComp = useRef(null);
  async function fileChange(e) {
    const files = e.target.files;
    const file = files[0];
    if (file) {
      const buffer = await file.arrayBuffer();
      pdfComp.current?.loadFile(buffer);
      const reReadBuffer = await file.arrayBuffer();
      pdfMobileComp.current?.loadFile(reReadBuffer);
      console.log(pdfComp.current);
    }
  }
  const rotate = useCallback(() => {
    pdfComp.current?.changeRotation();
  }, []);
  const jumpTo = useCallback((page) => {
    pdfComp.current?.setPage(page);
  }, []);
  const scale = useCallback((num) => {
    pdfComp.current?.setPageScale(num);
  }, []);
  useEffect(() => {
    // pdfComp.current.loadFile('/api/file?url=xxx')
    // 任意可以解决cors的pdf文件链接即可
  }, []);
  return (
    <>
      <input
        type="file"
        id="file"
        name="file"
        accept="pdf"
        onChange={fileChange}
      />
      <button onClick={() => setTheme("light")}>浅色主题</button>
      <button onClick={() => setTheme("dark")}>深色主题</button>
      <button onClick={rotate}>旋转</button>
      <button onClick={() => jumpTo(3)}>跳转到第3页</button>
      <button onClick={() => scale(0.8)}>缩放为80%</button>
      <PDF
        ref={pdfComp}
        theme={theme}
        renderOptions={customOptions}
        style={{
          width: "100%",
          height: "800px",
        }}
        onPagesLoaded={(v) => console.log("onPagesLoaded", v)}
        onPageRendered={(v) => console.log("onPageRendered", v)}
        onFindChange={(v) => console.log("onFindChange", v)}
        onLoadProgress={(v) => console.log("onLoadProgress", v)}
        onScaleChanging={(v) => console.log("onScaleChanging", v)}
      ></PDF>
      <PDF
        ref={pdfMobileComp}
        theme={theme}
        style={{
          width: "425px",
          height: "600px",
        }}
      ></PDF>
    </>
  );
}

export default App;
```

