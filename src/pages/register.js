import React from "react";
import { Layout } from "antd";
import RegisterForm from "../components/register-form";

const { Content } = Layout;

const Register = () => {
  return (
    <Layout className="content-layout">
      <Content className="login-container">
        <RegisterForm />
      </Content>
    </Layout>
  );
};

export default Register;
