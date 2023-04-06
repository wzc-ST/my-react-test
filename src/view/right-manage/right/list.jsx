/*
 * @Author: WZC
 * @Date: 2022-12-18 16:08:29
 * @FilePath: /src/view/right-manage/right/list.jsx
 * @Description: 权限列表
 */
import React, { useEffect, useState } from "react";
import { rightApi } from "@/api/modules/right";
import { Space, Tag, Table, Button, Modal, message, Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { confirm } = Modal;

export default function RightManageRightListPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "updatable";

  useEffect(() => {
    getList();
  }, []);

  /* 获取数据 */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    let res = await rightApi.getList();
    console.log("获取权限列表-res", res);

    let list = res;
    for (let item of list) {
      if (!item.children.length) {
        item.children = "";
      }
    }

    setList(list);
    setTotal(list.length);
    setLoading(false);
  };
  const paginationChange = (page, pageSize) => {
    console.log("page", page);
    console.log("pageSize", pageSize);
    // getList();
  };

  /* 编辑 */
  const onEdit = (record, index) => {
    console.log("record", record);
    console.log("index", index);
    messageApi.success("敬请期待");
  };

  /* 删除 */
  const onDel = (item) => {
    console.log("item", item);
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

        if (item.grade === 1) {
          await rightApi.del(item.id);
        } else {
          await rightApi.delChildren(item.id);
        }

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

  /* 开关 */
  const [switchLoading, setSwitchLoading] = useState(false);
  const switchChange = async (item) => {
    setSwitchLoading(true);

    console.log("开关-item", item);

    let pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    if (item.grade === 1) {
      await rightApi.update(item.id, {
        pagepermisson,
      });
    } else {
      await rightApi.updateChildren(item.id, {
        pagepermisson,
      });
    }

    setSwitchLoading(false);
    messageApi.success("操作成功");
  };

  /* 表格配置 */
  const columns = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "标题",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "key",
      dataIndex: "key",
      align: "center",
      render: (text, record, index) => (
        <span>
          <Tag color="orange">{text}</Tag>
        </span>
      ),
    },
    {
      title: "页面配置",
      key: "pagepermisson",
      align: "center",
      render: (_, record, index) =>
        typeof record.pagepermisson === "number" ? (
          <>
            <Switch
              loading={switchLoading}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked={record.pagepermisson === 1}
              onChange={() => switchChange(record)}
            />
          </>
        ) : (
          <>-</>
        ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 200,
      align: "center",
      render: (_, record, index) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit(record, index)}>
            编辑
          </Button>
          <Button
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => onDel(record)}
          ></Button>
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
        childrenColumnName="children"
        /* 分页接口版 */
        pagination={{
          position: ["bottomRight"],
          total,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 20,
          current: 1,
          pageSize: 20,
          pageSizeOptions: [20, 50, 100, 200],
          showSizeChanger: true,
          // 重新调用接口
          onChange: paginationChange,
        }}
        sticky
        scroll={{ y: "70vh" }}
      />
      {contextHolder}
    </div>
  );
}
