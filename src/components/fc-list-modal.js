import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { Form, Input } from "antd";

const FCListModal = ({ visible, setVisible, action }) => {
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
        title={`${action === "edit" ? "Edit Card" : "New Card"} `}
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
          <Form.Item label="Front" required>
            <Input />
          </Form.Item>
          <Form.Item label="Back" required>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FCListModal;
