/*
 * @Author: WZC
 * @Date: 2022-12-17 18:08:27
 * @FilePath: /src/layouts/components/sodeMenu.jsx
 * @Description: 侧边栏
 */
import React, { useMemo, useState } from "react";
import { Layout, Menu } from "antd";
import {
  CrownTwoTone,
  ContainerFilled,
  HomeOutlined,
  UsergroupDeleteOutlined,
  LockOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function SodeMenu(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const selectKeys = [location.pathname];
  const openKeys = ["/" + location.pathname.split("/")[1]];

  /* 处理成侧边栏需要的数据 */
  const permissionRouterList = useMemo(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const iconList = {
      "/home": <HomeOutlined />,
      "/user-manage": <UsergroupDeleteOutlined />,
      "/right-manage": <LockOutlined />,
      "/news-manage": <FileTextOutlined />,
      "/audit-manage": <FileSearchOutlined />,
      "/publish-manage": <SendOutlined />,
    };

    const checkPagePermission = (list) => {
      let newArr = [];
      for (let i of list) {
        // console.log("checkPagePermission-i", i);
        // pagepermisson 为1表示为页面
        if (i.pagepermisson === 1 && userInfo.role.rights.includes(i.key)) {
          let item = getItem(
            i.title,
            i.key,
            iconList[i.key] || null,
            null,
            null
          );
          if (i.children?.length > 0) {
            item.children = checkPagePermission(i.children);
            newArr.push(item);
          } else {
            newArr.push(item);
          }
        }
      }
      return newArr;
    };

    return [
      ...checkPagePermission(props.permissionList),
      // 静态页面
      { type: "divider", style: { background: "#fff" } },
      getItem("客户端", "news", <ContainerFilled />, null, null),
    ];
  }, [props.permissionList]);
  // console.log("permissionRouterList", permissionRouterList);

  const onMenu = ({ item, key, keyPath, domEvent }) => {
    if (location.pathname === key) return;
    // console.log("onMenu-click",  item, key, keyPath, domEvent );

    if (key === "news") {
      window.open("/" + key);
    } else {
      navigate(key);
    }
  };

  return (
    <Sider
      className="LayoutSiderBox"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => {
        setCollapsed(value);
        props.setCollapsedSuccess(value);
      }}
    >
      <div className="logo">
        {collapsed ? (
          <CrownTwoTone style={{ fontSize: "26px" }} />
        ) : (
          <span>{process.env.REACT_APP_title}</span>
        )}
      </div>
      <Menu
        onSelect={onMenu}
        className="LayoutMenuBox"
        theme="dark"
        mode="inline"
        selectedKeys={selectKeys}
        defaultOpenKeys={openKeys}
        items={permissionRouterList}
      />
    </Sider>
  );
}

/* Menu的栏目数据格式[https://ant-design.gitee.io/components/menu-cn#menuitemtype] */
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
