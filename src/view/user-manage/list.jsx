/*
 * @Author: WZC
 * @Date: 2022-12-18 16:08:01
 * @FilePath: /src/view/user-manage/list.jsx
 * @Description: 用户列表
 */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { Space, Table, Button, Modal, message, Switch, Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import AddOrEditModalBox from "./addOrEditMoadl";

import { userManageApi } from "@/api/modules/userManage";
import { roleApi } from "@/api/modules/role";

import { setPageLoading } from "@/redux/actionCreator/basicContentAction";

const { confirm } = Modal;

function UserManageListPage(props) {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getList();
    getRegionsList();
  }, []);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const [regionList, setregionList] = useState([]);

  const getList = async () => {
    let res = await userManageApi.getList();
    console.log("获取用户列表-res", res);

    setList(res);
    setTotal(res.length);
    setLoading(false);
  };
  const getRegionsList = async () => {
    let res = await roleApi.getRegionsList();
    console.log("getRegionsList-res", res);
    setregionList(res);
  };

  /* 添加、编辑 */
  const [addOrEditModalOpen, setaddOrEditModalOpen] = useState(false);
  const [addOrEditModalEditId, setaddOrEditModalEditId] = useState(null);
  const addOrEditModalShow = async (id) => {
    setaddOrEditModalOpen(true);
    setaddOrEditModalEditId(id);
  };
  const addOrEditModalOnSubmitSuccess = () => {
    setaddOrEditModalOpen(false);
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
        
        props.setPageLoading({
          show: true,
          title: "删除中",
        });

        await userManageApi.del(item.id);

        setTimeout(() => {
          messageApi.success("操作成功");
          props.setPageLoading({
            show: false,
          });
        }, 500);

        getList();
      },
    });
  };

  /* 开关 */
  const [switchLoading, setSwitchLoading] = useState(false);
  const switchChange = async (item) => {
    // setSwitchLoading(true);

    console.log("开关-item", item);

    let roleState = !item.roleState;
    await userManageApi.update(item.id, {
      roleState,
    });

    setSwitchLoading(false);

    messageApi.success("操作成功");
  };

  /* 表格配置 */
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      align: "center",
      render: (region) => <b>{region || "全球"}</b>,
      filters: [
        { text: "全球", value: "全球" },
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
      ],
      filterSearch: true,
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "角色名称",
      dataIndex: "role",
      align: "center",
      render: (role) => <span>{role.roleName}</span>,
    },
    {
      title: "状态",
      key: "roleState",
      align: "center",
      render: (_, record) => (
        <Switch
          loading={switchLoading}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          defaultChecked={record.roleState}
          disabled={record.default}
          onChange={() => switchChange(record)}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => addOrEditModalShow(record.id)}>
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
      <Row justify="end" style={{ marginBottom: "20px" }}>
        <Col>
          <Button type="primary" onClick={() => addOrEditModalShow()}>
            新增
          </Button>
        </Col>
      </Row>
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
      <AddOrEditModalBox
        addOrEditModalOpen={addOrEditModalOpen}
        addOrEditModalEditId={addOrEditModalEditId}
        addOrEditModalOnSubmitSuccess={addOrEditModalOnSubmitSuccess}
        addOrEditModalOnCancel={() => {
          setaddOrEditModalOpen(false);
        }}
      />
      {contextHolder}
    </div>
  );
}

const mapDispatchToProps = {
  setPageLoading,
};
export default connect(null, mapDispatchToProps)(UserManageListPage);
