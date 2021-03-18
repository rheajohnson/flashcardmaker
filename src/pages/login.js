import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { Form, Input, Button, Typography, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

import { login } from "../redux/actions/auth";
import { setMessage } from "../redux/actions/message";

const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const { isLoggedIn, userConfirmed } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMessage(""));
  }, []);

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    dispatch(login(username, password)).finally(() => setLoading(false));
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  if (userConfirmed === false) {
    return <Redirect to="/register" />;
  }

  return (
    <Content className="login-content">
      <section className="login-form-container">
        <Title level={2}>Sign in</Title>
        <Form className="login-form" onFinish={handleLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              autoComplete="on"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              autoComplete="on"
            />
          </Form.Item>

          {message && (
            <div className="message error">
              <Text type="danger"> {message}</Text>
            </div>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
          <aside className="login-form-action-aside">
            <Text>
              No account? <Link to="/register">Sign up</Link>
            </Text>
          </aside>
        </Form>
      </section>
    </Content>
  );
};

export default Login;
