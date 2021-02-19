import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory, Redirect } from "react-router-dom";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import { Typography } from "antd";

const { Title, Text, Link: AntLink } = Typography;

import { register, confirm } from "../redux/actions/auth";

import AuthService from "../services/auth-service";

import { setMessage } from "../redux/actions/message";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");

  const { isLoggedIn, userConfirmed } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) history.push("/");
    if (userConfirmed === false) setShowConfirm(true);
  });

  useEffect(() => {
    dispatch(setMessage(""));
  }, []);

  const handleRegister = ({ username, email, password }) => {
    setLoading(true);
    dispatch(register(username, email, password))
      .then(() => {
        setUsername(username);
        setLoading(false);
        setShowConfirm(true);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleConfirm = ({ code }) => {
    setLoading(true);
    dispatch(confirm(username, code))
      .then(() => {
        setLoading(false);
        setShowConfirm(true);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleConfirmCodeChange = () => {
    const codeVal = form.getFieldValue("code");
    if (codeVal) {
      const codeParsed = parseInt(codeVal);
      if (codeParsed) form.setFieldsValue({ code: codeVal });
      else form.setFieldsValue({ code: "" });
    }
  };

  const resendAuthCode = async () => {
    try {
      const resendConfirmResponse = await AuthService.resendConfirm(username);
      console.log(resendConfirmResponse);
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
          <Title level={2}>Verify your email</Title>
          <Text>Please enter the code sent to your email address.</Text>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={handleConfirm}
            form={form}
          >
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your confirmation code",
                },
              ]}
            >
              <Input
                placeholder="Confirmation code"
                maxLength={6}
                onChange={handleConfirmCodeChange}
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
                Verify
              </Button>
            </Form.Item>
            <div className="login-form-alternative-action-container">
              <Text>
                Didn&apos;t receive code?{" "}
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
              rules={[
                { required: true, message: "Please input your Password" },
              ]}
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
