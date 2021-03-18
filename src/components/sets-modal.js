import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Form, Input, Switch, Typography } from "antd";
import { updateSet, addSet } from "../redux/actions/sets";
import { clearMessage } from "../redux/actions/message";

const { Text } = Typography;

const SetsModal = ({ visible, setVisible, action }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const { selectedSet } = useSelector((state) => state.sets);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const handleOk = async ({ name, isPublic }) => {
    const cardType = isPublic ? "public" : "private";
    setLoading(true);
    if (action === "edit") {
      await dispatch(updateSet(name, cardType, selectedSet.id)).then(() =>
        setVisible(false)
      );
    }
    if (action === "add") {
      await dispatch(addSet(name, cardType)).then(() => setVisible(false));
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (!visible) {
      form.setFieldsValue({ name: "", isPublic: false });
    } else if (selectedSet && action === "edit") {
      form.setFieldsValue({
        name: selectedSet.name,
        isPublic:
          selectedSet.item_type && selectedSet.item_type.includes("public"),
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
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            type="primary"
            key="submit"
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
          {user && user.userRole === "admin" && (
            <Form.Item label="Public" name="isPublic" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
          {message && (
            <div className="message-error">
              <Text type="danger"> {message}</Text>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default SetsModal;
