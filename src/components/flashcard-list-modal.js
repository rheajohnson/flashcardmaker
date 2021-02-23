import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "antd";
import { Form, Input } from "antd";

import { updateFlashcard, addFlashcard } from "../redux/actions/flashcards";
import { getPublicSets, getUserSets } from "../redux/actions/sets";

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
          dispatch(getPublicSets());
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
        title={`${action === "edit" ? "Edit card" : "New card"} `}
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
            label="Front"
            name="front"
            required
            rules={[
              {
                required: true,
                message: "Please input a front for this flashcard!",
              },
              {
                min: 3,
                max: 120,
                message: "Please input value between 3 and 120 characters.",
              },
            ]}
          >
            <Input minLength={5} />
          </Form.Item>
          <Form.Item
            label="Back"
            name="back"
            required
            rules={[
              {
                required: true,
                message: "Please input a back for this flashcard!",
              },
              {
                min: 3,
                max: 120,
                message: "Please input value between 3 and 120 characters.",
              },
            ]}
          >
            <Input minLength={5} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FlashcardListModal;
