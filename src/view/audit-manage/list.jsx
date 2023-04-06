/*
 * @Author: WZC
 * @Date: 2023-03-12 18:13:25
 * @FilePath: /src/view/audit-manage/list.jsx
 * @Description: 审核管理-审核列表
 */
import React, { useEffect, useState } from "react";
import { Space, Table, Button, Modal, notification, Tag } from "antd";
import { useNavigate } from "react-router-dom";

import { auditManageApi } from "@/api/modules/auditManage";
import { newsManageApi } from "@/api/modules/newsManage";

const { confirm } = Modal;

export default function AuditManageList() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    getList(userInfo.username);
  }, [userInfo.username]);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);

  const getList = async (username) => {
    let res = await auditManageApi.getList(username);
    console.log("审核管理-审核列表-res", res);

    setList(res);
    setTotal(res.length);
    setLoading(false);
  };

  /* 预览 */
  const onPreview = (id) => {
    console.log("预览-id", id);
    navigate("/news-manage/preview/" + id);
  };

  /* 编辑 */
  const onEdit = async (id) => {
    console.log("编辑-id", id);
    navigate("/news-manage/update/" + id);
  };

  /* 撤销 */
  const onRevocation = (id) => {
    console.log("onRevocation-id", id);

    confirm({
      title: "提示",
      content: `是否撤销此数据？`,
      okText: "撤销",
      okType: "danger",
      onOk: async () => {
        await newsManageApi.update(id, {
          auditState: 0,
        });

        notification.success({
          message: "提示",
          description: `撤销成功，请前往草稿箱中查看`,
        });
        getList(userInfo.username);
      },
    });
  };
  /* 发布 */
  const onPublish = (id) => {
    console.log("onPublish-id", id);

    confirm({
      title: "提示",
      content: `是否发布此数据？`,
      okText: "发布",
      onOk: async () => {
        await newsManageApi.update(id, {
          publishState: 2,
          publishTime: Date.now(),
        });
        notification.success({
          message: "提示",
          description: `发布成功`,
        });
        navigate("/publish-manage/published");
      },
    });
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
      title: "审核状态",
      dataIndex: "auditState",
      align: "center",
      render: (render) => {
        const colorList = ["", "warning", "success", "error"];
        const titleList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[render]}>{titleList[render]}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 100,
      align: "center",
      render: (_, record, index) => (
        <Space size="middle">
          {record.auditState === 1 && (
            <Button danger onClick={() => onRevocation(record.id)}>
              撤销
            </Button>
          )}
          {record.auditState === 2 && (
            <Button type="primary" onClick={() => onPublish(record.id)}>
              发布
            </Button>
          )}
          {record.auditState === 3 && (
            <Button
              style={{ background: "#faad14", color: "#fff" }}
              onClick={() => onEdit(record.id)}
            >
              修改
            </Button>
          )}
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
    </div>
  );
}
