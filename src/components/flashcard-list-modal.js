import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "antd";
import { Form, Input } from "antd";

import { updateFlashcard, addFlashcard } from "../redux/actions/flashcards";
import { getUserSets } from "../redux/actions/sets";

const FlashcardListModal = ({ visible, setVisible, action }) => {
  const [loading, setLoading] = useState(false);
  const { selectedFlashcard } = useSelector((state) => state.flashcards);
  const { selectedSet } = useSelector((state) => state.sets);
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const handleOk = async ({ front, back }) => {
    setLoading(true);
    try {
      if (action === "edit") {
        dispatch(
          updateFlashcard(front, back, selectedSet.id, selectedFlashcard.id)
        ).then(() => {
          setVisible(false);
          setLoading(false);
        });
      }
      if (action === "add") {
        dispatch(addFlashcard(front, back, selectedSet.id)).then(() => {
          setVisible(false);
          setLoading(false);
          dispatch(getUserSets());
        });
      }
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
      form.setFieldsValue({ front: "", back: "" });
    } else if (selectedFlashcard && action === "edit") {
      form.setFieldsValue({
        front: selectedFlashcard.front,
        back: selectedFlashcard.back,
      });
    }
  }, [visible]);

  return (
    <>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        title={`${action === "edit" ? "Edit Card" : "New Card"} `}
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
          <Form.Item label="Front" name="front" required>
            <Input />
          </Form.Item>
          <Form.Item label="Back" name="back" required>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FlashcardListModal;
