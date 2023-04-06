/*
 * @Description: 配置跨域文件
 todo 安装：$ npm install http-proxy-middleware --save
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  /* 配置api `/ajax` 开头的url（可多个） */
  app.use(
    "/ajax",
    createProxyMiddleware({
      target: "https://i.maoyan.com",
      changeOrigin: true,
    })
  );

  // app.use(
  //   "/graphql",
  //   createProxyMiddleware({
  //     target: "http://localhost:3000",
  //     changeOrigin: true,
  //   })
  // );
};
