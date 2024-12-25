import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import {
    Toast
} from 'vant'

import {
    baseApi
} from './config/index'
import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.prototype.$toast = Toast
Vue.prototype.$baseApi = baseApi
Vue.config.productionTip = false
Vue.use(Vant)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
