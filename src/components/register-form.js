import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory, Redirect } from "react-router-dom";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import { Typography } from "antd";

const { Title, Text } = Typography;

import { register } from "../redux/actions/auth";

import { setMessage } from "../redux/actions/message";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(setMessage(""));
  }, []);

  const handleRegister = ({ username, email, password }) => {
    setLoading(true);

    dispatch(register(username, email, password))
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setLoading(false);
      });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-form-container">
      <Title level={2}>Sign up</Title>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleRegister}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email" }]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
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
            {loading ? "Signing up" : "Sign up"}
          </Button>
        </Form.Item>
        <div className="login-form-alternative-action-container">
          <Text>
            Have an account? <Link to="/login">Sign in</Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
