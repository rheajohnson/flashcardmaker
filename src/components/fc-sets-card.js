import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import DeleteConfirm from "./delete-confirm";

import { deleteSet } from "../redux/actions/sets";

const { Meta } = Card;

const FCSetsCard = ({ item, onCardModalOpen }) => {
  const [popOverVisible, setPopoverVisible] = useState(false);

  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    dispatch(deleteSet(id));
  };

  const content = (onCardModalOpen) => (
    <div className="fc-card-modal-content">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => {
          setPopoverVisible(false);
          onCardModalOpen("edit");
        }}
        onClick={() => {
          setPopoverVisible(false);
          onCardModalOpen("edit");
        }}
      >
        Edit
      </div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => {
          setPopoverVisible(false);
          DeleteConfirm(item.id, handleDelete);
        }}
        onClick={() => {
          setPopoverVisible(false);
          DeleteConfirm(item.id, handleDelete);
        }}
      >
        Delete
      </div>
    </div>
  );

  return (
    <Link to={`set/${3}`} className="fc-sets-card-link">
      <Card
        className="fc-card"
        hoverable
        onMouseLeave={() => setPopoverVisible(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fc-card-content">
          <Meta title={item.name} description={`Total Cards: ${item.count}`} />
        </div>

        <Popover
          placement="bottom"
          content={content(onCardModalOpen)}
          trigger="click"
          key={item.id}
          className="fc-card-popover"
          visible={popOverVisible}
        >
          <EllipsisOutlined
            onClick={() => setPopoverVisible(!popOverVisible)}
            className="fc-card-ellipsis"
            key="ellipsis"
          />
        </Popover>
      </Card>
    </Link>
  );
};

export default FCSetsCard;
