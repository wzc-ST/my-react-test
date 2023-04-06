/*
 * @Description: 路由懒加载
 */
import React from "react";
import { Spin } from "antd";

export default function LazyLoad(path) {
  const Comp = React.lazy(() => import(`@/view/${path}`));
  return (
    <React.Suspense fallback={<FallbackBox />}>
      <Comp />
    </React.Suspense>
  );
}

function FallbackBox() {
  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin tip="页面载入中..." size="large" />
    </div>
  );
}
