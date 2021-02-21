import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import { Layout, PageHeader } from "antd";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth-service";
import Loading from "../components/loading";

const { Content } = Layout;

const Account = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(async () => {
    try {
      const response = await AuthService.getUserAttributes();
      const { Value } = response.find((attr) => attr.Name === "email");
      setEmail(Value);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Layout className="content-layout">
      <PageHeader title="Account" className="content-page-header" />
      <Content className="content">
        {loading ? (
          <Loading />
        ) : (
          <div className="site-layout-content">
            <Form form={form} layout="vertical">
              <Form.Item label="Username">
                <Input value={user.username} disabled />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={email} disabled />
              </Form.Item>
              <Form.Item label="Role">
                <Input value="user" disabled />
              </Form.Item>
            </Form>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Account;
