import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Form, Input, Switch } from "antd";
import { updateSet, addSet } from "../redux/actions/sets";
import { getUser } from "../redux/actions/auth";

const SetsModal = ({ visible, setVisible, action }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const { selectedSet } = useSelector((state) => state.sets);

  const dispatch = useDispatch();

  const handleOk = async ({ name, isPublic }) => {
    const cardType = isPublic ? "public" : "private";
    setLoading(true);
    if (action === "edit") {
      await dispatch(updateSet(name, cardType, selectedSet.id));
    }
    if (action === "add") {
      await dispatch(addSet(name, cardType));
      await dispatch(getUser());
    }
    setVisible(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
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

  const cleanValue = (e) => {
    const { value } = e.target;
    const valueTrimed =
      value.trim().length > 0 ? e.target.value.replace(/  +/g, " ") : "";
    form.setFieldsValue({
      [e.target.id]: valueTrimed,
    });
  };

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
            <Input onChange={(e) => cleanValue(e)} />
          </Form.Item>
          {user && user.userRole === "admin" && (
            <Form.Item label="Public" name="isPublic" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default SetsModal;
