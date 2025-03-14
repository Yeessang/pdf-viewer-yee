import { useMemo } from 'react';
const baseTheme = {
  "light": {
    '--pdf-toolbar-bg': '#fff',
    '--pdf-toolbar-input-bg': 'rgb(241 245 249)',
    '--pdf-toolbar-text-color': 'rgb(55 65 81)',
    '--pdf-toolbar-text-highlight': 'rgb(99 102 241)',
    '--pdf-toolbar-bg-highlight': 'rgb(241 245 249)',
    '--pdf-show-bg': 'rgb(241 245 249)',
    '--pdf-thumbnail-bg': 'rgb(241, 245, 249)',
    '--pdf-thumbnail-border-color': '#6366f11a',
    '--pdf-thumbnail-text-color': 'rgb(55 65 81)',
    '--pdf-thumbnail-text-color-highlight': 'rgb(99 102 241)',
    '--pdf-catalogue-text-color': 'rgb(55 65 81)',
    '--pdf-catalogue-text-highlight': 'rgb(99 102 241)',
    '--pdf-menu-setting-color': 'rgb(55 65 81)',
    '--highlight-bg-color': 'rgba(230, 0, 120, 1)',
    '--highlight-selected-bg-color': 'rgba(100, 0, 0, 1)',
    '--pdf-mask-bg-color': 'rgba(241, 245, 249, .9)',
    '--pdf-mask-process-bg-color': '#D7D7E0',
    '--pdf-mask-process-highlight': 'rgb(167 139 250)',
    '--pdf-mask-tip-color': 'rgb(107 114 128)',
    '--pdf-mask-btn-color': 'rgb(167 139 250)',
    '--pdf-mask-btn-highlight': 'rgb(192 132 252)'
  },
  "dark": {
    '--pdf-toolbar-bg': '#222',
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
export function useTheme(theme) {
  const topicVariable = useMemo(() => {
    const type = typeof theme
    if (type == "string") {
      return baseTheme[theme] || baseTheme["dark"]
    }
    return { ...theme }
  }, [theme])

  return topicVariable
}