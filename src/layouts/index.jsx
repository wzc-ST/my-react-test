/*
 * @Description: 框架主页面
 */
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";

import "./index.less";

import SodeMenu from "./components/sodeMenu";
import TopHeader from "./components/topHeader";

import { userApi } from "@/api/modules/user";

const { Content } = Layout;

function Layouts(props) {
  const [LayoutML, setLayoutML] = useState(200);
  const [permissionList, setPermissionList] = useState();
  const [expansionAllList, setexpansionAllList] = useState();

  // 获取全部权限列表
  useEffect(() => {
    async function fetchData() {
      let res = await userApi.getPermissionList();
      console.log("获取全部权限列表-res", res);
      setPermissionList(res || []);
      setexpansionAllList(treeToArr(res));
    }
    fetchData();
  }, []);

  return (
    permissionList && (
      <Layout className="LayoutBox">
        <SodeMenu
          setCollapsedSuccess={(e) => {
            setLayoutML(e ? 80 : 200);
          }}
          permissionList={permissionList}
        />
        <Layout
          className="LayoutMainBox"
          style={{
            marginLeft: LayoutML,
          }}
        >
          <TopHeader expansionAllList={expansionAllList} />
          <Content id="LayoutContentBox" className="LayoutContentBox">
            {/* 全局动画 */}
            <Spin
              spinning={props.pageLoading}
              tip={props.pageLoadingTitle || "Loading..."}
              size="large"
              style={{ minHeight: "80vh" }}
            >
              {/* 路由容器（嵌套路由导入） */}
              <Outlet />
            </Spin>
          </Content>
        </Layout>
      </Layout>
    )
  );
}

/* 给组件传递的值（redux的值） */
const mapStateToProps = ({ basicContentState }) => ({
  pageLoading: basicContentState.pageLoading,
  pageLoadingTitle: basicContentState.pageLoadingTitle,
});
/* 给组件传递的回调函数 (通知方法) */
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Layouts);

// 正向-树形结构转平铺,从外到内依次递归，有 children 则继续递归
function treeToArr(data, pid = null, res = []) {
  data.forEach((item) => {
    res.push({ pid: pid, ...item });
    if (item.children && item.children.length !== 0) {
      treeToArr(item.children, item.id, res);
    }
  });
  return res;
}
