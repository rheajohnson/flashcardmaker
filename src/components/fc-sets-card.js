import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import DeleteConfirm from "./delete-confirm";
import { useHistory } from "react-router-dom";

import { deleteSet, setSet } from "../redux/actions/sets";

const { Meta } = Card;

const FCSetsCard = ({ item, onCardModalOpen }) => {
  const [popOverVisible, setPopoverVisible] = useState(false);
  const { allSets } = useSelector((state) => state.sets);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = async (id) => {
    dispatch(deleteSet(id));
  };

  const handleSelect = (id) => {
    const set = allSets.find((set) => set.id === id);
    dispatch(setSet(set));
    history.push(`set/${id}`);
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
    <Card
      className="fc-card"
      hoverable
      onMouseLeave={() => setPopoverVisible(false)}
      onClick={() => {
        handleSelect(item.id);
      }}
      onKeyDown={() => {
        handleSelect(item.id);
      }}
    >
      <div className="fc-card-content">
        <Meta title={item.name} description={`Total Cards: ${item.count}`} />
      </div>
      <div
        className="fc-menu-container"
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
          className="fc-card-popover"
          visible={popOverVisible}
        >
          <EllipsisOutlined
            onClick={() => setPopoverVisible(!popOverVisible)}
            className="fc-card-ellipsis"
            key="ellipsis"
          />
        </Popover>
      </div>
    </Card>
  );
};

export default FCSetsCard;
