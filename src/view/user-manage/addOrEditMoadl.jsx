/*
 * @Author: WZC
 * @Date: 2023-03-01 22:18:48
 * @FilePath: /src/view/user-manage/addOrEditMoadl.jsx
 * @Description: 新增、编辑-对话框
 */
import React, { useEffect, useState } from "react";

import { roleApi } from "@/api/modules/role";
import { Modal, Form, Input, Select } from "antd";
import { userManageApi } from "@/api/modules/userManage";

export default function AddOrEditModalBox({
  addOrEditModalOpen,
  addOrEditModalEditId,
  addOrEditModalOnSubmitSuccess,
  addOrEditModalOnCancel,
}) {
  // 1：add、 2：edit
  const [addOrEditModalType, setaddOrEditModalType] = useState(1);
  const addOrEditModalEditTypeTitle = ["", "新增", "编辑"];

  const { Option } = Select;

  const [form] = Form.useForm();
  // 监听form中的值
  const roleIdValue = Form.useWatch("roleId", form);

  useEffect(() => {
    // 获取详情
    const getInfo = async (id) => {
      let res = await userManageApi.getinfo({ id });
      console.log("getinfo-res", res);
      form.setFieldsValue(res[0]);
    };

    if (!addOrEditModalOpen) return;
    getRegionsList();
    getRoleList();
    setaddOrEditModalType(addOrEditModalEditId ? 2 : 1);
    // 获取详情（接口获取已有异步、如是从参数过来的对象，需要用延时器做异步处理）
    addOrEditModalEditId && getInfo(addOrEditModalEditId);
  }, [addOrEditModalOpen, addOrEditModalEditId, form]);

  // 获取数据
  const [regionList, setregionList] = useState([]);
  const [roleList, setroleList] = useState([]);
  const getRegionsList = async () => {
    let res = await roleApi.getRegionsList();
    console.log("getRegionsList-res", res);
    setregionList(res);
  };
  const getRoleList = async () => {
    let res = await roleApi.getList();
    console.log("getRoleList-res", res);
    setroleList(res);
  };

  // 提交
  const [confirmLoading, setconfirmLoading] = useState(false);
  const onSubmit = async () => {
    // form校验
    const formObj = await form
      .validateFields()
      .then((res) => res)
      .catch(() => false);
    if (!formObj) return;
    console.log("validate-ok", formObj);

    setconfirmLoading(true);

    // 发送请求
    if (addOrEditModalType === 1) {
      await userManageApi.add({
        ...formObj,
        roleState: true,
        default: false,
      });
    } else {
      await userManageApi.update(addOrEditModalEditId, formObj);
    }

    // 清空form中的值
    form.resetFields();
    setconfirmLoading(false);
    addOrEditModalOnSubmitSuccess();
  };

  return (
    <Modal
      open={addOrEditModalOpen}
      title={addOrEditModalEditTypeTitle[addOrEditModalType]}
      destroyOnClose
      maskClosable={false}
      confirmLoading={confirmLoading}
      onCancel={addOrEditModalOnCancel}
      onOk={() => onSubmit()}
    >
      <Form
        form={form}
        name="addOrEditForm"
        preserve={false}
        labelCol={{ span: 4 }}
        style={{ marginTop: "20px" }}
      >
        <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
          <Input allowClear placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
          <Input.Password allowClear placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          name="region"
          label="地区"
          rules={[{ required: roleIdValue !== 1 }]}
        >
          <Select
            placeholder="请选择地区"
            allowClear
            showSearch
            optionFilterProp="children"
            disabled={roleIdValue === 1}
          >
            {regionList.map((item) => (
              <Option value={item.value} key={item.id}>
                {item.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="roleId" label="角色" rules={[{ required: true }]}>
          <Select
            placeholder="请选择角色"
            allowClear
            showSearch
            optionFilterProp="children"
            onChange={(e) => {
              if (e === 1) {
                // 设置form中的值
                form.setFieldsValue({
                  region: "",
                });
              }
            }}
          >
            {roleList.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
