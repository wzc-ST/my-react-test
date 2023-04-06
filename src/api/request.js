/*
 * @Description: axios封装
 */
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

/* 配置请求域名 */
export let baseURL = "http://localhost:5000";

/* 创建axios的一个实例 */
const instance = axios.create({
  baseURL,
  // baseURL: "/http", // 配置跨域
  timeout: 60000, // 请求超时毫秒数
  method: "post",
});

/* 请求拦截器 */
instance.interceptors.request.use(
  (config) => {
    // 进度条显示
    NProgress.start();

    // 登陆后请求携带 token
    config.headers.token = "";
    return config;
  },
  (error) => {
    // 抛出服务器响应错误
    return Promise.reject(error);
  }
);

/* 响应拦截器 */
instance.interceptors.response.use(
  (response) => {
    // 进度条隐藏
    NProgress.done();

    // 判断接口返回的数据
    // console.log("请求结果-response", response);
    return response;
  },
  (error) => {
    // // 抛出服务器响应错误
    // ElMessage({
    //   message: error,
    //   type: "error",
    //   duration: 3 * 1000,
    // });
    return Promise.reject(error);
  }
);

export default instance;
