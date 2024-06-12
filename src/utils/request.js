import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui';
import store from "@/store";

//创建axios实例对象
const request = axios.create({
  baseURL: '/api',
  timeout: 600000
})

// axios请求拦截器
request.interceptors.request.use(
  (config)=> {
    let isLoggedIn = store.getters.isLoggedIn;
    if(isLoggedIn){
      let loginInfo = store.getters.userInfo;
      config.headers['token'] = loginInfo.token;
    }
    return config;
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    console.log('error: ' + error)
    let { message } = error;
    if (message.includes('401')) {
      Message.error('会话超时,请重新登录')
      router.push('/login')
    }else {
      Message.error('系统接口访问异常')
    }
    return Promise.reject(error)
  }
)

export default request