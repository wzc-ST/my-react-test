/*
 * @Author: WZC
 * @Date: 2023-03-12 18:13:21
 * @FilePath: /src/view/news-manage/draft.jsx
 * @Description: 新闻管理-草稿箱
 */
import React, { useEffect, useState } from "react";
import { Space, Table, Button, Modal, message, notification } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { newsManageApi } from "@/api/modules/newsManage";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

export default function NewsManageDraft() {
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "updatable";
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    getList(userInfo.username);
  }, [userInfo.username]);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);

  const getList = async (username) => {
    let res = await newsManageApi.getdraftList(username);
    console.log("草稿箱-列表-res", res);

    setList(res);
    setTotal(res.length);
    setLoading(false);
  };

  /* 编辑 */
  const onEdit = async (id) => {
    console.log("编辑-id", id);
    navigate("/news-manage/update/" + id);
  };

  /* 删除 */
  const onDel = (id) => {
    console.log("删除-id", id);

    confirm({
      title: "提示",
      content: "是否删除此数据？",
      okText: "删除",
      okType: "danger",
      onOk: async () => {
        console.log("OK");

        messageApi.open({
          key: messageKey,
          type: "loading",
          content: "删除中...",
        });

        await newsManageApi.del(id);

        setTimeout(() => {
          messageApi.open({
            key: messageKey,
            type: "success",
            content: "删除成功!",
          });
        }, 500);

        getList();
      },
    });
  };

  /* 提交审核 */
  const onRelease = (id) => {
    console.log("提交审核-id", id);

    confirm({
      title: "提示",
      content: "是否提交审核此数据？",
      okText: "提交",
      onOk: async () => {
        // console.log("OK");
        await newsManageApi.update(id, {
          auditState: 1,
        });
        notification.success({
          message: "提示",
          description: "提交成功，待审核",
        });
        navigate("/audit-manage/list");
      },
    });
  };

  /* 预览 */
  const onPreview = (id) => {
    console.log("预览-id", id);
    navigate("/news-manage/preview/" + id);
  };

  /* 表格配置 */
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: "80px",
      align: "center",
      render: (render) => {
        return <b>{render}</b>;
      },
    },
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
      width: 250,
      align: "center",
      render: (_, record, index) => (
        <Space size="middle">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => onEdit(record.id)}
          ></Button>
          <Button
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => onDel(record.id)}
          ></Button>
          <Button onClick={() => onRelease(record.id)}>提交审核</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={{
          position: ["bottomRight"],
          total,
          showTotal: (total) => `共 ${total} 条`,
        }}
        sticky
        scroll={{ y: "70vh" }}
      />
      {contextHolder}
    </div>
  );
}
