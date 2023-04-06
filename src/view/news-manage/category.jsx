/*
 * @Author: WZC
 * @Date: 2023-03-12 18:13:25
 * @FilePath: /src/view/news-manage/category.jsx
 * @Description: 新闻管理-新闻分类
 */
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Space,
  Table,
  Button,
  message,
  Form,
  Input,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { newsManageApi } from "@/api/modules/newsManage";
// import { useNavigate } from "react-router-dom";

// const { confirm } = Modal;
const EditableContext = React.createContext(null);

export default function NewsManageCategory() {
  const [messageApi, contextHolder] = message.useMessage();
  // const messageKey = "updatable";
  // const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    let res = await newsManageApi.getCategoriesList();
    console.log("新闻分类", res);

    setList(res);
    setTotal(res.length);
    setLoading(false);
  };

  /* 删除 */
  const onDel = (id) => {
    messageApi.info("Hello, Ant Design!");
  };

  /* 表格配置 */
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  const handleSave = (row) => {
    const newData = [...list];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setList(newData);
  };

  const defaultColumns = [
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
      title: "名称",
      dataIndex: "title",
      align: "center",
      editable: true,
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
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => onDel(record.id)}
          ></Button>
        </Space>
      ),
    },
  ];
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

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
        components={components}
      />
      {contextHolder}
    </div>
  );
}
