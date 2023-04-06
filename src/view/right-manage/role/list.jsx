/*
 * @Author: WZC
 * @Date: 2022-12-18 16:08:17
 * @FilePath: /src/view/right-manage/role/list.jsx
 * @Description: 角色列表
 */
import React, { useEffect, useState } from "react";
import { roleApi } from "@/api/modules/role";
import { rightApi } from "@/api/modules/right";
import { Space, Tree, Table, Button, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { confirm } = Modal;

export default function RightManageRoleListPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "updatable";

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    let res = await roleApi.getList();
    console.log("获取角色列表-res", res);

    setList(res);
    setTotal(res.length);
    setLoading(false);
  };
  const getRightAllList = async () => {
    let res = await rightApi.getList();
    console.log("获取全部权限-res", res);
    setTreeList(res);
  };

  /* 编辑 */
  const [editForm, setEditForm] = useState({
    id: "",
    rights: [],
  });

  const onEdit = async (record, index) => {
    console.log("record", record);
    // console.log("index", index);

    await getRightAllList();
    setEditForm(record);
    setExpandedKeys(record.rights);
    setIsModalOpen(true);
  };
  const editSave = async () => {
    console.log("editForm", editForm);

    await roleApi.update(editForm.id, {
      rights: editForm.rights,
    });

    setIsModalOpen(false);
    getList();
    messageApi.success("操作成功");
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

        await roleApi.del(item.id);

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

  /* 树形控件 */
  // 设置已选中的父节点
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 设置父节点可以折叠
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  // 树形节点选中
  const [treeList, setTreeList] = useState([]);
  const onCheck = (checkedKeysValue) => {
    // console.log("onCheck", checkedKeysValue);
    setEditForm({
      ...editForm,
      rights: checkedKeysValue,
    });
  };

  /* 表格配置 */
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: "80px",
      align: "center",
    },
    {
      title: "标题",
      dataIndex: "roleName",
      align: "center",
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
        pagination={{
          position: ["bottomRight"],
          total,
          showTotal: (total) => `共 ${total} 条`,
        }}
        sticky
        scroll={{ y: "70vh" }}
      />
      <Modal
        title="编辑权限"
        open={isModalOpen}
        destroyOnClose
        onOk={() => {
          editSave();
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Tree
          height={400}
          checkable
          blockNode
          showLine
          treeData={treeList}
          checkedKeys={editForm.rights}
          selectable={false}
          onCheck={onCheck}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        />
      </Modal>
      {contextHolder}
    </div>
  );
}
