import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import DeleteConfirm from "./delete-confirm";
import { useHistory } from "react-router-dom";

import { deleteSet, setSet } from "../redux/actions/sets";

const { Meta } = Card;

const SetsCard = ({ item, onCardModalOpen, editable }) => {
  const [popOverVisible, setPopoverVisible] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = (id) => {
    return dispatch(deleteSet(id));
  };

  const handleSelect = (id) => {
    dispatch(setSet(id)).then(() => history.push(`set/${id}`));
  };

  const content = (onCardModalOpen) => (
    <div className="card-modal-content">
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
    <Card
      className="card"
      hoverable
      onMouseLeave={() => setPopoverVisible(false)}
      onClick={() => {
        handleSelect(item.id);
      }}
      onKeyDown={() => {
        handleSelect(item.id);
      }}
    >
      <div className="card-content">
        <Meta title={item.name} description={`Total Cards: ${item.count}`} />
      </div>
      {editable && (
        <div
          className="menu-container"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="button"
          tabIndex={0}
        >
          <Popover
            placement="bottom"
            content={content(onCardModalOpen)}
            trigger="click"
            key={item.id}
            className="card-popover"
            visible={popOverVisible}
          >
            <EllipsisOutlined
              onClick={() => setPopoverVisible(!popOverVisible)}
              className="card-ellipsis"
              key="ellipsis"
            />
          </Popover>
        </div>
      )}
    </Card>
  );
};

export default SetsCard;
