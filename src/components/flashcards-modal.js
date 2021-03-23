import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "antd";
import { Form, Input } from "antd";

import { updateFlashcard, addFlashcard } from "../redux/actions/flashcards";
import { getSets } from "../redux/actions/sets";

const FlashcardListModal = ({ visible, setVisible, action }) => {
  const [loading, setLoading] = useState(false);
  const { selectedFlashcard } = useSelector((state) => state.flashcards);
  const { selectedSet } = useSelector((state) => state.sets);
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const handleOk = async ({ term, definition }) => {
    setLoading(true);
    try {
      if (action === "edit") {
        dispatch(
          updateFlashcard(
            term,
            definition,
            selectedSet.id,
            selectedFlashcard.id
          )
        ).then(() => {
          setVisible(false);
          setLoading(false);
        });
      }
      if (action === "add") {
        dispatch(addFlashcard(term, definition, selectedSet.id)).then(() => {
          setVisible(false);
          setLoading(false);
          dispatch(getSets());
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
      form.setFieldsValue({ term: "", definition: "" });
    } else if (selectedFlashcard && action === "edit") {
      form.setFieldsValue({
        term: selectedFlashcard.term,
        definition: selectedFlashcard.definition,
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
        onCancel={handleCancel}
        title={`${action === "edit" ? "Edit card" : "New card"} `}
        footer={[
          <Button key="definition" onClick={handleCancel}>
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
            name="term"
            required
            rules={[
              {
                required: true,
                message: "Please input a term for this flashcard!",
              },
              {
                min: 3,
                max: 120,
                message: "Please input value between 3 and 120 characters.",
              },
            ]}
          >
            <Input onChange={(e) => cleanValue(e)} />
          </Form.Item>
          <Form.Item
            label="Back"
            name="definition"
            required
            rules={[
              {
                required: true,
                message: "Please input a definition for this flashcard!",
              },
              {
                min: 3,
                max: 120,
                message: "Please input value between 3 and 120 characters.",
              },
            ]}
          >
            <Input onChange={(e) => cleanValue(e)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FlashcardListModal;
