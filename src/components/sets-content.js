import React from "react";
import { PageHeader, Layout, List, Breadcrumb, Button } from "antd";
import { useSelector } from "react-redux";
import SetsCard from "../components/sets-card";

const { Content } = Layout;

const SetsContent = ({ type, sets, onModalOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const editable =
    type === "private" || (user && user.userRole && user.userRole === "admin");

  const getActions = () => {
    return editable
      ? [
          <Button key="1" type="primary" onClick={() => onModalOpen("add")}>
            New set
          </Button>,
        ]
      : [];
  };

  return (
    <Content className="content">
      <PageHeader
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              {type === "public" ? "Public sets" : "My sets"}
            </Breadcrumb.Item>
          </Breadcrumb>
        }
        className="content-header"
        extra={getActions()}
      />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
        }}
        locale={{ emptyText: "No flashcard sets" }}
        dataSource={sets || []}
        renderItem={(item) => (
          <List.Item>
            <SetsCard
              item={item}
              editable={editable || (user && user.userRole === "admin")}
              onCardModalOpen={() => onModalOpen("edit", item.id)}
            />
          </List.Item>
        )}
      />
    </Content>
  );
};

export default SetsContent;
