/*
 * @Author: WZC
 * @Date: 2023-03-12 18:12:45
 * @FilePath: /src/view/news-manage/form.jsx
 * @Description: 新闻管理- 撰写/更新 新闻
 * 
状态：
  auditState 
    0 未审核(草稿箱)
    1 正在审核
    2 已通过
    3 未通过

  publishState
    0 未发布
    1 待发布
    2 已发布
    3 已下线
 */
import React, { useState, useEffect, useMemo } from "react";
import {
  Divider,
  Typography,
  Steps,
  Button,
  Space,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import style from "./index.module.less";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { Editor, Toolbar } from "@wangeditor/editor-for-react";

import { newsManageApi } from "@/api/modules/newsManage";

export default function NewsManageForm() {
  const navigate = useNavigate();
  const params = useParams();

  // const { Title } = Typography;
  const [messageApi, messageContextHolder] = message.useMessage();

  // 0:add，1:edit
  const [pageType, setpageType] = useState(null);
  const pageTypeTitle = useMemo(() => {
    return ["撰写", "更新"][pageType];
  }, [pageType]);

  // 步骤
  const [stepsCurrent, setstepsCurrent] = useState(0);

  // 表单
  const [infoForm] = Form.useForm();
  const [ContentFormVal, setContentFormVal] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    console.log("params", params);
    const { id } = params;
    setpageType(id ? 1 : 0);
    id && getInfo(id, infoForm);
  }, [params, infoForm]);

  // 获取详情
  const getInfo = async (id, infoForm) => {
    console.log("id", id);
    let res = await newsManageApi.getInfo(id);
    console.log("getInfo-res", res);

    infoForm.setFieldsValue(res);
    setTimeout(() => {
      setContentFormVal(res.content);
    }, 1000);
  };

  const onPreviousStep = () => {
    setstepsCurrent(stepsCurrent - 1);
  };
  const onNextStep = async () => {
    if (stepsCurrent === 0) {
      await infoForm
        .validateFields()
        .then(async (value) => {
          console.log("value", value);
        })
        .catch((err) => {
          throw err;
        });
    } else if (stepsCurrent === 1) {
      if (!ContentFormVal) {
        messageApi.warning("内容不能为空");
        throw new Error("内容不能为空");
      }
      console.log("ContentFormVal", ContentFormVal);
    }

    setstepsCurrent(stepsCurrent + 1);
  };

  const handleSave = async (type) => {
    console.log("type", type);
    console.log("getFieldsValue", infoForm.getFieldsValue());
    let form = {
      ...infoForm.getFieldsValue(),
      content: ContentFormVal,
      region: userInfo.region ? userInfo.region : "全球",
      author: userInfo.username,
      roleId: userInfo.roleId,
      auditState: type,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
    };
    console.log("form", form);

    if (pageType) {
      const { id } = params;
      await newsManageApi.update(id, form);
    } else {
      await newsManageApi.add(form);
    }

    notification.success({
      message: "提示",
      description: type
        ? "提交成功，待审核"
        : pageType
        ? "草稿箱已更新"
        : "已保存入草稿箱",
    });
    navigate(type ? "/audit-manage/list" : "/news-manage/draft");
  };

  return (
    <Typography>
      <div className={style.newsManageTopTitleBox}>
        <div
          className={style.newsManageTopReturnIcon}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftOutlined />
        </div>
        <Divider type="vertical" />
        <div className={style.newsManageTopTitle}>{pageTypeTitle}新闻</div>
      </div>
      <Divider />
      <div className="mainBox">
        <Steps
          current={stepsCurrent}
          items={[
            {
              title: "基本信息",
              description: "新闻标题、分类",
            },
            {
              title: "新闻内容",
              description: "新闻主体内容",
            },
            {
              title: "新闻提交",
              description: "保存草稿、提交审核",
            },
          ]}
        />
        <div className={style.contentBox}>
          {/* 基本信息 */}
          <div className={stepsCurrent === 0 ? "infoFormBox" : style.hideForm}>
            <InfoFormBox form={infoForm} />
          </div>
          {/* 新闻内容 */}
          <div
            className={stepsCurrent === 1 ? "contentFormBox" : style.hideForm}
          >
            <ContentFormBox
              val={ContentFormVal}
              setVal={(e) => {
                setContentFormVal(e === "<p><br></p>" ? "" : e);
              }}
            />
          </div>
          {/* 新闻提交 */}
          <div className={stepsCurrent === 2 ? "submitBox" : style.hideForm}>
            <Space>
              <Button
                type="text"
                style={{ backgroundColor: "#e6a23c", color: "#fff" }}
                onClick={() => handleSave(0)}
              >
                保存草稿箱
              </Button>
              <Button type="primary" onClick={() => handleSave(1)}>
                提交审核
              </Button>
            </Space>
          </div>
        </div>
        <div className="btnBox" style={{ marginTop: "20px" }}>
          <Space>
            {stepsCurrent !== 0 && (
              <Button onClick={() => onPreviousStep()}>上一步</Button>
            )}
            {stepsCurrent >= 0 && stepsCurrent < 2 && (
              <Button type="primary" onClick={() => onNextStep()}>
                下一步
              </Button>
            )}
          </Space>
        </div>
      </div>
      {messageContextHolder}
    </Typography>
  );
}

function InfoFormBox({ form }) {
  const { Option } = Select;
  const [categoryList, setcategoryList] = useState([]);

  useEffect(() => {
    async function getList() {
      let res = await newsManageApi.getCategoriesList();
      console.log("getCategoriesList-res", res);
      setcategoryList(res);
    }
    getList();
  }, []);

  return (
    <Form form={form} name="infoForm" labelCol={{ span: 2 }}>
      <Form.Item name="title" label="新闻标题" rules={[{ required: true }]}>
        <Input allowClear placeholder="请输入新闻标题" />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="新闻分类"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="请选择新闻分类"
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {categoryList.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}

function ContentFormBox({ val, setVal }) {
  // editor 实例
  const [editor, setEditor] = useState(null);

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 工具栏配置
  const toolbarConfig = {};
  // 编辑器配置
  const editorConfig = {
    placeholder: "请输入内容...",
  };

  return (
    <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: "1px solid #ccc" }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={val}
        onCreated={setEditor}
        onChange={(editor) => setVal(editor.getHtml())}
        mode="default"
        style={{ height: "500px", overflowY: "hidden" }}
      />
    </div>
  );
}
