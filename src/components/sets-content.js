import React from "react";
import { PageHeader, Layout, List, Breadcrumb, Button } from "antd";
import { useSelector } from "react-redux";
import SetsCard from "../components/sets-card";

const { Content } = Layout;

const SetsContent = ({ type, sets, editable, onModalEditOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const renderActions = () => {
    const action = [];
    if (editable) {
      action.push(
        <Button key="1" type="primary" onClick={() => onModalEditOpen("add")}>
          New set
        </Button>
      );
    }
    return action;
  };

  return (
    <>
      <PageHeader
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              {type === "public" ? "Public sets" : "My sets"}
            </Breadcrumb.Item>
          </Breadcrumb>
        }
        className="content-page-header"
        extra={renderActions()}
      />
      <Content className="content">
        <div className="site-card-wrapper">
          <List
            grid={{
              gutter: 16,
            }}
            locale={{ emptyText: "No flashcard sets" }}
            dataSource={sets}
            renderItem={(item) => (
              <List.Item>
                <SetsCard
                  item={item}
                  editable={editable || (user && user.userRole === "admin")}
                  onCardModalOpen={() => onModalEditOpen("edit", item.id)}
                />
              </List.Item>
            )}
          />
        </div>
      </Content>
    </>
  );
};

export default SetsContent;
