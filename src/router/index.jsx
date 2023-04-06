/*
 * @Description: 路由配置
 */
import React, { useEffect, useMemo } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import Redirect from "./components/Redirect";
import AuthComponent from "./components/AuthComponent";
import LazyLoad from "./components/LazyLoad";
import Layouts from "../layouts";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function RouterIndex() {
  return (
    <BrowserRouter>
      <Element />
    </BrowserRouter>
  );
}

// 生成路由
function Element() {
  // 进度条显示/隐藏
  NProgress.start();

  useEffect(() => {
    NProgress.done();
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // 路由处理
  const permissionRouter = useMemo(() => {
    // 我的权限
    const authList = userInfo && userInfo.role ? userInfo.role.rights : [];

    // 需要权限控制的路由
    const authRouterList = [
      {
        path: "/home",
        element: LazyLoad("home"),
      },
      /* 用户管理 */
      {
        path: "/user-manage/list",
        title: "用户列表",
        element: LazyLoad("user-manage/list"),
      },
      /* 权限管理 */
      {
        path: "/right-manage/role/list",
        element: LazyLoad("right-manage/role/list"),
      },
      {
        path: "/right-manage/right/list",
        element: LazyLoad("right-manage/right/list"),
      },
      /* 新闻管理 */
      {
        path: "/news-manage/add",
        element: LazyLoad("news-manage/form"),
      },
      {
        path: "/news-manage/update/:id",
        element: LazyLoad("news-manage/form"),
      },
      {
        path: "/news-manage/draft",
        element: LazyLoad("news-manage/draft"),
      },
      {
        path: "/news-manage/category",
        element: LazyLoad("news-manage/category"),
      },
      {
        path: "/news-manage/preview/:id",
        element: LazyLoad("news-manage/preview"),
      },
      /* 审核管理 */
      {
        path: "/audit-manage/audit",
        element: LazyLoad("audit-manage/audit"),
      },
      {
        path: "/audit-manage/list",
        element: LazyLoad("audit-manage/list"),
      },
      /* 发布管理 */
      {
        path: "/publish-manage/unpublished",
        element: LazyLoad("publish-manage/unpublished"),
      },
      {
        path: "/publish-manage/published",
        element: LazyLoad("publish-manage/published"),
      },
      {
        path: "/publish-manage/sunset",
        element: LazyLoad("publish-manage/sunset"),
      },
    ];

    // 本地路由
    const routerList = [
      {
        path: "/",
        element: <AuthComponent>{<Layouts />}</AuthComponent>,
        children: [
          {
            path: "",
            element: <Redirect to="/home" />,
          },
          ...filterRoutes(),
        ],
      },
      {
        path: "/login",
        element: LazyLoad("login"),
      },
      /* 游客系统 */
      {
        path: "/news",
        element: LazyLoad("clientNews"),
      },
      {
        path: "/news/:id",
        element: LazyLoad("clientNews/details"),
      },
      {
        path: "*",
        element: LazyLoad("nowFound"),
      },
    ];

    // 权限校验
    function filterRoutes() {
      const list = authRouterList.filter(
        (route) =>
          authList.includes(route.path) && route.ifRenderingRouter !== false
      );
      // console.log("list", list);
      return list;
    }

    return routerList;
  }, [userInfo]);
  // console.log("permissionRouter", permissionRouter);

  const element = useRoutes(permissionRouter);
  return element;
}
