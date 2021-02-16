import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const DeleteConfirm = async (id, fn) => {
  Modal.confirm({
    title: "Are you sure you want to delete?",
    icon: <ExclamationCircleOutlined />,
    okText: "Delete",
    cancelText: "Cancel",
    onOk: async () => fn(id),
    onCancel() {},
  });
};

export default DeleteConfirm;
