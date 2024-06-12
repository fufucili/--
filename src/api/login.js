import request from '@/utils/request'
import axios from 'axios'

//登录
export const loginApi = (loginForm) => request.post('/login', loginForm)
