# @pdf-viewer-yee/pdf-viewer-vue2

一款Vue2框架开发的pdf阅读器组件，如果您使用的是Vue3，可以查看[Vue3PDF阅读器组件地址](https://www.npmjs.com/package/@pdf-viewer-yee/pdf-viewer-vue3)，如果您使用的是React，可以查看[ReactPDF阅读器组件地址](https://www.npmjs.com/package/@pdf-viewer-yee/pdf-viewer-react)


## demo

[demo地址](https://codesandbox.io/p/devbox/nice-keller-75ns2d?file=%2Fsrc%2FApp.vue%3A1%2C1-39%2C1)

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
npm install @pdf-viewer-yee/pdf-viewer-vue2
```


```vue
<template>
  <div id="app">
    <div>
      <button @click="openFile">选择文件</button>
      <input v-show="false" ref="fileInput" type="file" @change="handleFileChange">
      <button @click="theme = 'dark'">黑色主题</button>
      <button @click="theme = 'light'">浅色主题</button>
      <button @click="customTheme">自定义主题</button>
      <PDF
        ref="pdfComp"
        :theme="theme"
        style="width: 100%; height: 600px; margin: auto;"
      ></PDF>
      <PDF
        ref="pdfMobileComp"
        :theme="theme"
        @pagesLoaded="(v) => log('pagesLoaded', v)"
        @pageRendered="(v) => log('pageRendered', v)"
        @pageChanging="(v) => log('pageChanging', v)"
        @findChange="(v) => log('findChange', v)"
        @scaleChanging="(v) => log('scaleChanging 缩放比例改变', v)"
        style="width: 300px; height: 300px; margin-left: 20px; margin-bottom: 500px;"
      ></PDF>
    </div>
  </div>
</template>

<script>
import PDF from '@pdf-viewer-yee/pdf-viewer-vue2';
import '@pdf-viewer-yee/pdf-viewer-vue2/package/pdf-viewer.css';

export default {
  name: 'App',
  components: {
    PDF
  },
  data() {
    return {
      theme: "dark"
    }
  },
  mounted() {
    // this.$refs.pdfMobileComp?.loadFile("/group1/M00/97/9C/CgAAcGeJz0-ATDbzANrzRz61tBw876.pdf");
    // this.$refs.pdfComp?.loadFile("/group1/M00/97/9C/CgAAcGeJz0-ATDbzANrzRz61tBw876.pdf")
    
  },
  methods: {
    async handleFileChange(event) {
      const files = event.target.files
      const file = files[0]
      console.log(file, "File")
      if (file) {
        const buffer = await file.arrayBuffer()
        this.$refs.pdfMobileComp?.loadFile(buffer);
        const reReadBuffer = await file.arrayBuffer()
        this.$refs.pdfComp?.loadFile(reReadBuffer)
      }
    },
    openFile() {
      this.$refs.fileInput?.click();
    },
    log(name, v) {
      console.log(name, v)
    },
    customTheme() {
      this.theme = {
        '--pdf-toolbar-bg': '#ccc',
        '--pdf-toolbar-input-bg': '#141414',
        '--pdf-toolbar-text-color': '#EBEBEB',
        '--pdf-toolbar-text-highlight': 'rgb(99 102 241)',
        '--pdf-toolbar-bg-highlight': '#39383D',
        '--pdf-show-bg': '#39383D',
        '--pdf-thumbnail-bg': '#222',
        '--pdf-thumbnail-border-color': '#39383D',
        '--pdf-thumbnail-text-color': '#EBEBEB',
        '--pdf-thumbnail-text-color-highlight': 'rgb(99 102 241)',
        '--pdf-catalogue-text-color': '#EBEBEB',
        '--pdf-catalogue-text-highlight': 'rgb(99 102 241)',
        '--pdf-menu-setting-color': '#EBEBEB',
        '--highlight-bg-color': 'rgba(230, 0, 120, 1)',
        '--highlight-selected-bg-color': 'rgba(100, 0, 0, 1)',
        '--pdf-mask-bg-color': 'rgba(34, 34, 34, .9)',
        '--pdf-mask-process-bg-color': '#D7D7E0',
        '--pdf-mask-process-highlight': 'rgb(167 139 250)',
        '--pdf-mask-tip-color': 'rgb(107 114 128)',
        '--pdf-mask-btn-color': 'rgb(167 139 250)',
        '--pdf-mask-btn-highlight': 'rgb(192 132 252)'
      }
    }
  }
}
</script>

<style>
</style>

```

