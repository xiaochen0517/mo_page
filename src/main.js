import * as Vue from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import axios from 'axios'
import api from './http/api';

// axios 拦截器
import './http/axios'

const app = Vue.createApp(App);
app.config.globalProperties.axios = axios;
app.config.globalProperties.$api = api;
app.use(ElementPlus)
app.mount('#app')
