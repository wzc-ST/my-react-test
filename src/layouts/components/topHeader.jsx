/*
 * @Author: WZC
 * @Date: 2022-12-17 18:08:29
 * @FilePath: /src/layouts/components/topHeader.jsx
 * @Description: 头部框架
 */
import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import {
  Layout,
  Dropdown,
  Avatar,
  Modal,
  notification,
  Breadcrumb,
} from "antd";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { confirm } = Modal;

export default function TopHeader(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  /* 面包屑处理 */
  const routePath = location.pathname;
  // console.log("routePath", routePath);
  // console.log("props.expansionAllList", props.expansionAllList);
  let breadcrumbItems = [];
  if (routePath === "/home") {
    // 首页单独处理
    breadcrumbItems = [
      {
        title: (
          <>
            <HomeOutlined style={{ fontSize: "14px" }} />
            <span>首页</span>
          </>
        ),
        key: "home",
      },
    ];
  } else {
    // 页面层级集合
    let extraBreadcrumbItems = [];
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    // console.log("pathSnippets", pathSnippets);
    pathSnippets.forEach((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      // console.log("url", url);
      let routerItem = props.expansionAllList.find((e) => e.key === url);
      // console.log("routerItem", routerItem);

      if (routerItem) {
        extraBreadcrumbItems.push({
          key: url,
          title:
            routerItem.pagepermisson !== 1 ||
            !routerItem.pid ||
            routerItem.key === routePath ? (
              <span>{routerItem.title}</span>
            ) : (
              <Link to={url}>{routerItem.title}</Link>
            ),
        });
      } else if (url === "/news-manage/preview") {
        extraBreadcrumbItems.push({
          key: url,
          title: "文章预览",
        });
      }
    });
    // console.log("extraBreadcrumbItems", extraBreadcrumbItems);

    breadcrumbItems = [
      {
        title: (
          <Link to="/">
            <HomeOutlined style={{ fontSize: "14px" }} />
          </Link>
        ),
        key: "home",
      },
    ].concat(extraBreadcrumbItems);
  }
  // console.log("breadcrumbItems", breadcrumbItems);

  /* Dropdown数据 */
  const items = [
    {
      label: <span style={{ color: "#000" }}>{userInfo.role.roleName}</span>,
      key: "admin",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      danger: true,
      label: "退出",
      key: "exit",
    },
  ];
  const dropdownClick = ({ key }) => {
    console.log("dropdownClick-key", key);
    if (key === "exit") {
      confirm({
        title: "提示",
        content: "是否退出此账号？",
        okText: "退出",
        okType: "danger",
        onOk: () => {
          notification.success({
            message: "提示",
            description: "账号退出成功！",
          });
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          navigate("/login");
        },
      });
    }
  };

  return (
    <Header className="LayoutHeaderBox">
      <div className="LayoutHeader_left">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="LayoutHeader_right">
        <span style={{ marginRight: "12px" }}>
          欢迎
          <span style={{ color: "#1677ff", margin: "0 3px" }}>
            {userInfo.username}
          </span>
          回来
        </span>
        <Dropdown
          menu={{
            items,
            onClick: dropdownClick,
          }}
        >
          <span>
            <Avatar shape="square" icon={<UserOutlined />} />
          </span>
        </Dropdown>
      </div>
    </Header>
  );
}
