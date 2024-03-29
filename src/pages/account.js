import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { Layout, PageHeader, Breadcrumb, Form, Input } from "antd";

import Loading from "../components/loading";

const { Content } = Layout;

const Account = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    setLoading(false);
  });

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Content className="content">
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageHeader
            title={
              <Breadcrumb>
                <Breadcrumb.Item>Account</Breadcrumb.Item>
              </Breadcrumb>
            }
            className="content-header"
          />
          <div className="account-form-container">
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
        </>
      )}
    </Content>
  );
};

export default Account;
