/*
 * @Author: WZC
 * @Date: 2023-03-23 21:56:43
 * @FilePath: /src/view/publish-manage/components/list.jsx
 * @Description: 发布管理-列表公共
 */
import React from "react";
import { Space, Table } from "antd";

import { useNavigate } from "react-router-dom";

// const { confirm } = Modal;

export default function PublishManageList({ list, total, loading, button }) {
  const navigate = useNavigate();

  /* 预览 */
  const onPreview = (id) => {
    console.log("预览-id", id);
    navigate("/news-manage/preview/" + id);
  };

  /* 表格配置 */
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      align: "center",
      render: (render, renderObj) => {
        return (
          <span
            onClick={() => onPreview(renderObj.id)}
            style={{ color: "#1677ff", cursor: "pointer" }}
          >
            {render}
          </span>
        );
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      align: "center",
    },
    {
      title: "分类",
      dataIndex: "category",
      align: "center",
      render: (render) => {
        return render.title;
      },
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 260,
      align: "center",
      render: (_, record, index) => {
        return <Space size="middle">{button(record.id)}</Space>;
      },
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        /* 分页全部数据版 */
        pagination={{
          position: ["bottomRight"],
          defaultPageSize: 20,
          total,
          showTotal: (total) => `共 ${total} 条`,
        }}
        sticky
        /* 自适应页面 */
        scroll={{
          y: document.getElementById("LayoutContentBox").clientHeight - 160,
        }}
      />
    </div>
  );
}
