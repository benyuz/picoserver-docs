// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  
  enhanceApp({ router }) {
    // 路由变化时上报百度统计
    router.onBeforeRouteChange = (to) => {
      if (typeof _hmt !== 'undefined') {
        _hmt.push(['_trackPageview', to])
      }
    }
  }
}
