import React from "react";
import RouterIndex from "./router";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider, FloatButton } from "antd";

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterIndex />
      <FloatButton.BackTop />
    </ConfigProvider>
  );
}
