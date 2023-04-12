
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'

import {
	$http
} from '@escook/request-miniprogram' // 请求包在mainjs中
 
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net/api'

// 请求开始之前做一些事情 拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}

// 请求完成之后做一些事情 响应器
$http.afterRequest = function (response) {
  if(response.data.meta.status !== 200){
	  return uni.$showMsg()
  }
 // uni.$showMsg('数据加载成功')
 uni.hideLoading()
}
uni.$http = $http
// 封装自定义提示组件
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif