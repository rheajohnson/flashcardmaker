import React, { useState } from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { Popconfirm } from "antd";

const FCSetsCard = ({ item, onCardModalOpen, onCardDelete }) => {
  const [popOverVisible, setPopoverVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const content = (onCardModalOpen, onCardDelete, id) => (
    <div onClick={() => setPopoverVisible(false)}>
      <p onClick={() => onCardModalOpen("edit")}>Edit</p>
      <p onClick={() => setConfirmDeleteVisible(true)}>Delete</p>
    </div>
  );

  const confirm = () => {
    console.log("deleting");
    onCardDelete();
  };

  return (
    <Card
      className="fc-card"
      actions={[
        <Popover
          placement="bottom"
          content={content(onCardModalOpen, onCardDelete, item.id)}
          trigger="click"
          key={item.id}
          className="fc-card-popover"
          visible={popOverVisible}
          onClick={() => setPopoverVisible(!popOverVisible)}
        >
          <Popconfirm
            placement="bottom"
            title="Are you sure you want to delete?"
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
            visible={confirmDeleteVisible}
            onCancel={() => setConfirmDeleteVisible(false)}
          >
            <EllipsisOutlined key="ellipsis" />
          </Popconfirm>
        </Popover>,
      ]}
    >
      <Link to={`/set/${item.id}`} className="fc-card-link">
        {item.title}
      </Link>
    </Card>
  );
};

export default FCSetsCard;
