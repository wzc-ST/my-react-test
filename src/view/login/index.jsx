import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";

import { Button, Form, Input, message, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import Particles from "reactparticles.js";
import { userApi } from "@/api/modules/user";

export default function Login() {
  const navigate = useNavigate();
  // 表单
  const [loginForm] = Form.useForm();

  useEffect(() => {
    // 开发环境
    if (process.env.NODE_ENV === "development") {
      loginForm.setFieldsValue({
        username: "admin",
        password: "123456",
      });
    }
  }, [loginForm]);

  const onLogin = async (values) => {
    console.log("Received values of form: ", values);

    const res = await userApi.login(values);
    console.log("res", res);

    if (!res.length) {
      message.error("账号或密码错误");
    } else {
      localStorage.setItem("token", "12345678");
      localStorage.setItem("userInfo", JSON.stringify(res[0]));
      navigate("/");
      notification.success({
        message: "提示",
        description: "账号登陆成功！",
      });
    }
  };

  return (
    <div className="loginPageBox">
      <div className="loginFormBox">
        <h2>{process.env.REACT_APP_title}</h2>
        <Form
          form={loginForm}
          name="loginForm"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onLogin}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入您的账号" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="账号"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入您的密码" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item className="login-form-button-box">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Particles
        id="loginPageParticles"
        style={{
          height: "99%",
          zIndex: 1,
        }}
        config="loginPageParticles.json"
      />
    </div>
  );
}
