import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "antd";
import { Form, Input } from "antd";

import { updateSet, addSet } from "../redux/actions/sets";

const FCSetsModal = ({ visible, setVisible, action }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { selectedSet } = useSelector((state) => state.sets);

  const dispatch = useDispatch();

  const handleOk = async ({ name, description }) => {
    setLoading(true);
    try {
      if (action === "edit") {
        dispatch(updateSet(name, description, selectedSet.id));
      }
      if (action === "add") {
        dispatch(addSet(name, description));
      }
      setVisible(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) {
      form.setFieldsValue({ name: "", description: "" });
    } else if (selectedSet && action === "edit") {
      form.setFieldsValue({
        name: selectedSet.name,
        description: selectedSet.description,
      });
    }
  }, [visible]);

  return (
    <>
      <Modal
        visible={visible}
        title={`${action === "edit" ? "Edit Set" : "New Set"} `}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={form.submit}
          >
            Save
          </Button>,
        ]}
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item label="Name" name="name" required>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FCSetsModal;
