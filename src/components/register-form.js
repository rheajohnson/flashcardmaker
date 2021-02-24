import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory, Redirect } from "react-router-dom";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import { Typography } from "antd";

const { Title, Text, Link: AntLink } = Typography;

import { register, getUser } from "../redux/actions/auth";

import AuthService from "../services/auth-service";

import { setMessage } from "../redux/actions/message";

const RegisterForm = () => {
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
      dispatch(getUser(false, null));
      setShowConfirm(true);
    }
  }, [userConfirmed]);

  useEffect(() => {
    if (userConfirmed !== false) setShowConfirm(false);
    dispatch(setMessage(""));
  }, []);

  const handleRegister = ({ username, email, password }) => {
    setLoading(true);
    dispatch(register(username, email, password))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
    <div className="login-form-container">
      {showConfirm ? (
        <>
          <Title level={2}>Please verify your email</Title>
          <Text>
            We sent an email confirmation to your email. Please confirm your
            email before signing in.
          </Text>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={() => history.push("/login")}
            form={form}
          >
            {message && (
              <div
                className={
                  messageType === "success"
                    ? "login-form-message"
                    : "login-form-error"
                }
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

            <div className="login-form-alternative-action-container">
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
          <Form
            name="normal_login"
            className="login-form"
            onFinish={handleRegister}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                autoComplete="on"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
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
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                autoComplete="off"
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
                Sign up
              </Button>
            </Form.Item>
            <div className="login-form-alternative-action-container">
              <Text>
                Have an account? <Link to="/login">Sign in</Link>
              </Text>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default RegisterForm;
