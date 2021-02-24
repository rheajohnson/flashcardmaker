import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "antd";
import { Form, Input, Switch, Typography } from "antd";

import { updateSet, addSet } from "../redux/actions/sets";
import { getUser } from "../redux/actions/auth";
import { clearMessage } from "../redux/actions/message";

const { Text } = Typography;

const SetsModal = ({ visible, setVisible, action }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const { selectedSet } = useSelector((state) => state.sets);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const handleOk = async ({ name, type }) => {
    try {
      const cardType = type ? "public" : "private";
      if (action === "edit") {
        await dispatch(updateSet(name, cardType, selectedSet.id)).then(() => {
          setVisible(false);
        });
      }
      if (action === "add") {
        await dispatch(addSet(name, cardType)).then(() => {
          dispatch(getUser());
          setVisible(false);
        });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (!visible) {
      form.setFieldsValue({ name: "", type: false });
    } else if (selectedSet && action === "edit") {
      form.setFieldsValue({
        name: selectedSet.name,
        type: selectedSet.item_type && selectedSet.item_type.includes("public"),
      });
    }
  }, [visible]);

  return (
    <>
      <Modal
        visible={visible}
        title={`${action === "edit" ? "Edit set" : "New set"} `}
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
          <Form.Item
            label="Name"
            name="name"
            required
            rules={[
              {
                required: true,
                message: "Please input a name for the set!",
              },
              {
                min: 3,
                max: 40,
                message: "Please input value between 3 and 40 characters.",
              },
            ]}
          >
            <Input minLength={5} />
          </Form.Item>
          {user && user.userRole === "user" && (
            <Form.Item label="Public" name="type" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
          {message && (
            <div className="login-form-error">
              <Text type="danger"> {message}</Text>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default SetsModal;
