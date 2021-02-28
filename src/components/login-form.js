import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

import { login } from "../redux/actions/auth";

import { setMessage } from "../redux/actions/message";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const { isLoggedIn, userConfirmed } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMessage(""));
  }, []);

  const handleLogin = ({ username, password }) => {
    setLoading(true);
    dispatch(login(username, password)).catch(() => {
      setLoading(false);
    });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  if (userConfirmed === false) {
    return <Redirect to="/register" />;
  }

  return (
    <div className="login-form-container">
      <Title level={2}>Sign in</Title>
      <Form name="normal_login" className="login-form" onFinish={handleLogin}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            autoComplete="on"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            autoComplete="on"
          />
        </Form.Item>

        {message && (
          <div className="login-form-error">
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
        <div className="login-form-alternative-action-container">
          <Text>
            No account? <Link to="/register">Sign up</Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
