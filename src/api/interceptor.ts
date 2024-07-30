import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store';

export interface HttpResponse<T = unknown> {
  // status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      // 判断headers里面是否包含Authorization属性
      // 登录接口会带Authorization, 因oauth需要basic认证
      if (
        !Object.prototype.hasOwnProperty.call(config.headers, 'Authorization')
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // 配置语言
    if (config.headers) {
      config.headers['Accept-Language'] =
        localStorage.getItem('cc-locale') || 'zh-CN';
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    if (res.code !== 200) {
      Message.error({
        content: res.msg || 'Error',
        duration: 5 * 1000,
      });

      // 401 续签token 如续签失败清空鉴权 重定向到登录页
      //  code非200 为错误
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
