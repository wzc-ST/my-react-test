/*
 * @Author: WZC
 * @Date: 2023-03-12 18:13:25
 * @FilePath: /src/view/audit-manage/audit.jsx
 * @Description: 审核管理-审核新闻
 */
import React, { useEffect, useState } from "react";
import { Space, Table, Button, Modal, notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { auditManageApi } from "@/api/modules/auditManage";
import { useNavigate } from "react-router-dom";
import { newsManageApi } from "@/api/modules/newsManage";

const { confirm } = Modal;

export default function AuditManageAudit() {
  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const { roleId, region, username } = userInfo;
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };

    let res = await auditManageApi.getAuditList();
    console.log("获取审核新闻管理列表-res", res);
    let newList =
      roleObj[roleId] === "superadmin"
        ? res
        : [
            ...res.filter((item) => {
              return (
                item.author === username ||
                (item.region === region && roleObj[item.roleId] === "editor")
              );
            }),
          ];
    console.log("newList", newList);
    setList(newList);
    setTotal(newList.length);
    setLoading(false);
  };

  /* 预览 */
  const onPreview = (id) => {
    console.log("预览-id", id);
    navigate("/news-manage/preview/" + id);
  };

  const handleAudit = (id, type) => {
    console.log("handleAudit-id", id);

    let typeTitle = ["通过", "驳回"][type];

    let ajaxData = {
      auditState: type ? 3 : 2,
      publishState: type ? 0 : 1,
    };

    confirm({
      title: "提示",
      content: `是否${typeTitle}此数据？`,
      okText: typeTitle,
      okType: type ? "danger" : null,
      onOk: async () => {
        await newsManageApi.update(id, ajaxData);
        notification.success({
          message: "提示",
          // description: `您可以到【审核管理/审核列表】中查询您新闻的审核状态！`,
          description: `审核成功！`,
        });
        getList();
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
      title: "操作",
      key: "action",
      fixed: "right",
      align: "center",
      render: (_, record, index) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleAudit(record.id, 0)}
          >
            通过
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleAudit(record.id, 1)}
          >
            驳回
          </Button>
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
