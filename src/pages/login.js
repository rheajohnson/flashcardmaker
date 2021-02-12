import React from "react";
import { Layout } from "antd";
import LoginForm from "../components/login-form";

const { Content } = Layout;

const Login = () => {
  return (
    <Layout className="content-layout">
      <Content className="login-container">
        <LoginForm />
      </Content>
    </Layout>
  );
};

export default Login;
