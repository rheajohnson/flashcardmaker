import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory, Redirect } from "react-router-dom";

import { register } from "../redux/actions/auth";
import AuthService from "../services/auth-service";
import { setMessage } from "../redux/actions/message";
import { getUser } from "../redux/actions/auth";

import { Form, Input, Button, Typography, Layout } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text, Link: AntLink } = Typography;
const { Content } = Layout;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { isLoggedIn, userConfirmed, user } = useSelector(
    (state) => state.auth
  );
  const { message, messageType } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (userConfirmed === false) {
      setShowConfirm(true);
    } else setShowConfirm(false);
  }, [userConfirmed]);

  useEffect(() => {
    dispatch(setMessage(""));
  }, []);

  const handleRegister = ({ username, email, password }) => {
    setLoading(true);
    dispatch(register(username, email, password)).finally(() => {
      setLoading(false);
    });
  };

  const handleContinueToSignIn = () => {
    dispatch(getUser()).then(() => history.push("/login"));
  };

  const resendAuthCode = async () => {
    try {
      await AuthService.resendSignUp(user.username);
      dispatch(setMessage("Verification email sent.", "success"));
    } catch (e) {
      dispatch(setMessage(e.message));
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const [form] = Form.useForm();
  return (
    <Content className="login-content">
      <section className="login-form-container">
        {showConfirm ? (
          <>
            <Title level={2}>Please verify your email</Title>
            <Text>
              We sent an email confirmation to your email. Please confirm your
              email before signing in.
            </Text>
            <Form
              className="login-form"
              onFinish={handleContinueToSignIn}
              form={form}
            >
              {message && (
                <div
                  className={`message ${
                    messageType === "success" ? "success" : "error"
                  }`}
                >
                  <Text type={messageType}>{message}</Text>
                </div>
              )}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                >
                  Continue to sign in
                </Button>
              </Form.Item>

              <div className="login-form-action-aside">
                <Text>
                  Didn&apos;t receive an email?{" "}
                  <AntLink
                    role="button"
                    tabIndex={0}
                    onKeyPress={() => resendAuthCode()}
                    onClick={() => resendAuthCode()}
                  >
                    Send again
                  </AntLink>
                </Text>
              </div>
            </Form>
          </>
        ) : (
          <>
            <Title level={2}>Sign up</Title>
            <Form className="login-form" onFinish={handleRegister}>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your Username" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  autoComplete="on"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Please input your Email" }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  autoComplete="on"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                />
              </Form.Item>
              {message && (
                <div className="message error">
                  <Text type="danger">{message}</Text>
                </div>
              )}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                >
                  Sign up
                </Button>
              </Form.Item>
              <aside className="login-form-action-aside">
                <Text>
                  Have an account? <Link to="/login">Sign in</Link>
                </Text>
              </aside>
            </Form>
          </>
        )}
      </section>
    </Content>
  );
};

export default Register;
