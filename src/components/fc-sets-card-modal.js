import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { Form, Input } from "antd";

const FCSetsCardModal = ({ visible, setVisible, action }) => {
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    setVisible(visible);
  });

  const [form] = Form.useForm();

  return (
    <>
      <Modal
        visible={visible}
        title={`${action === "edit" ? "Edit Set" : "Add New Set"} `}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" required>
            <Input />
          </Form.Item>
          <Form.Item label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FCSetsCardModal;
