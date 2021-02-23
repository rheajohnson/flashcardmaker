import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import { Layout, PageHeader, Breadcrumb } from "antd";
import { Redirect } from "react-router-dom";
import Loading from "../components/loading";

const { Content } = Layout;

const Account = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Layout className="content-layout">
      <PageHeader
        title={
          <Breadcrumb>
            <Breadcrumb.Item>Account</Breadcrumb.Item>
          </Breadcrumb>
        }
        className="content-page-header"
      />
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
                <Input value={user.email} disabled />
              </Form.Item>
              <Form.Item label="Role">
                <Input value={user.userRole} disabled />
              </Form.Item>
            </Form>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Account;
